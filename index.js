let allComments = [];

function extractCommentData(data) {
  if (!Array.isArray(data)) {
    console.error("Input data must be an array");
    return [];
  }

  return data
    .map((obj) => {
      if (obj?.$type !== "com.linkedin.voyager.dash.social.Comment") {
        return null;
      }

      const commenter = obj.commenter || {};
      const commentary = obj.commentary || {};

      const user = {
        userName: commenter.title?.text || "Unknown",
        jobTitle: commenter.subtitle || "Unknown",
        profileUrl: commenter.navigationUrl || "Unknown",
        commentText: commentary.text || "No comment",
        commentUrn: obj.entityUrn || "Unknown",
      };

      allComments.push(user);
      return user;
    })
    .filter((comment) => comment !== null);
}

async function fetchData(userPostURN, postId, start, count, reply) {
  const postUrn1 = userPostURN?.replaceAll(":", "%3A") || "";
  const postId1 = postId?.replaceAll(":", "%3A") || "";
  const postUrn = `urn%3Ali%3A${postUrn1}`;

  if (!postUrn || !postId) {
    console.error("Invalid postUrn or postId:", { postUrn, postId });
    return;
  }

  try {
    const res = await fetch(
      `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(count:${count},numReplies:${reply},socialDetailUrn:urn%3Ali%3Afsd_socialDetail%3A%28${postUrn}%2C${postId1}%2Curn%3Ali%3AhighlightedReply%3A-%29,sortOrder:RELEVANCE,start:${start})&queryId=voyagerSocialDashComments.95ed44bc87596acce7c460c70934d0ff`,
      {
        method: "GET",
        headers: {
          "csrf-token":
            document.cookie.match(/JSESSIONID="(ajax:\d+[^"]*)"/)?.[1] || "",
          Cookie: document.cookie,
          Accept: "application/vnd.linkedin.normalized+json+2.1",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    // Use data.included if it exists, otherwise fallback to data
    const commentsData = Array.isArray(data.included) ? data.included : [];
    const users = extractCommentData(commentsData);

    if (users.length === 0) {
      console.log("No comments found in this batch");
      return;
    }

    console.log("Users who commented on this post:", users);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

function getCommentId() {
  const commentContainer = document?.body?.querySelector(
    "div.feed-shared-update-v2__comments-container"
  );
  const commentList = commentContainer?.querySelector(
    "div.comments-comment-list__container"
  );
  const allComments = Array.from(
    commentList?.querySelectorAll(":scope > article.comments-comment-entity") ||
      []
  );
  const comment = allComments[0];
  return comment?.getAttribute("data-id") || null;
}

function extractUrnParts(urn) {
  const match = urn?.match(/urn:li:comment:\(([^,]+),([^)]+)\)/) || [];
  return match.length > 2 ? { postUrn: match[1], commentId: match[2] } : null;
}

function getUpdateUrn() {
  const el = document.querySelector(
    "div.full-height[data-view-tracking-scope]"
  );
  if (!el) return null;

  const scope = el.getAttribute("data-view-tracking-scope");
  try {
    const parsed = JSON.parse(scope.replace(/"/g, '"'));
    return parsed?.[0]?.breadcrumb?.updateUrn || null;
  } catch (e) {
    console.error("Failed to parse data-view-tracking-scope:", e);
    return null;
  }
}

function getCommentCount() {
  const btn = document.querySelector(
    'button[aria-label*="comments"].social-details-social-counts__btn'
  );
  if (!btn) return 0;

  const text = btn.getAttribute("aria-label") || "";
  const match = text.match(/([\d,]+)\s+comments/i);
  if (!match) return 0;

  return parseInt(match[1].replace(/,/g, ""), 10);
}

async function fetchAllComments() {
  const urn = getCommentId();
  const postUrnData = extractUrnParts(urn);
  const postId = getUpdateUrn();

  const count = 100;
  const reply = 10;
  let start = 0;
  let maxComments = getCommentCount();

  const pages = Math.ceil(maxComments / count);

  if (postUrnData?.postUrn && postId && maxComments > 0) {
    for (let i = 0; i < pages; i++) {
      await fetchData(postUrnData.postUrn, postId, start, count, reply);
      start += count;
    }
  } else {
    console.log("No comments found");
  }

  if (allComments.length > 0) {
    console.log("allComments-", allComments.length, allComments);
  }
}

fetchAllComments();
