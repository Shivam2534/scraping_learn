// Function to extract user data from the API response
let allLikesArray = [];

function extractUserData(jsonData) {
  const users = [];

  // Check if the response has the expected structure
  if (!jsonData?.included) {
    console.error('No "included" section found in the response');
    return users;
  }

  // Iterate through the 'included' section
  jsonData.included.forEach((item) => {
    if (item["$type"] === "com.linkedin.voyager.dash.social.Reaction") {
      const reactor = item.reactorLockup || {};
      const userData = {
        name: reactor.title?.text || "N/A",
        headline: reactor.subtitle?.text || "N/A",
        profile_url: reactor.navigationUrl || "N/A",
        connection_degree: reactor.label?.text || "N/A",
        reaction_type: item.reactionType || "N/A",
        profile_urn: item.actor?.["*profileUrn"] || "N/A",
        profile_picture: "N/A",
      };

      // Extract profile picture URL
      const imageAttributes = reactor.image?.attributes || [];
      for (const attr of imageAttributes) {
        const vectorImage =
          attr.detailData?.nonEntityProfilePicture?.vectorImage || {};
        const artifacts = vectorImage.artifacts || [];
        for (const artifact of artifacts) {
          if (artifact.width === 200) {
            userData.profile_picture = `${vectorImage.rootUrl || ""}${
              artifact.fileIdentifyingUrlPathSegment
            }`;
            break;
          }
        }
        if (userData.profile_picture !== "N/A") break;
      }

      allLikesArray.push(userData);

      users.push(userData);
    }
  });

  return users;
}

// Function to fetch reaction data
async function fetchData(userPostURN, start, count) {
  const postUrn1 = userPostURN.replaceAll(":", "%3A");
  const postUrn = `urn%3Ali%3A${postUrn1}`;
  try {
    const res = await fetch(
      `https://www.linkedin.com/voyager/api/graphql?variables=(count:${count},start:${start},threadUrn:${postUrn})&queryId=voyagerSocialDashReactions.78a64a3508374043e1d8c20396164408`,
      {
        method: "GET",
        headers: {
          "csrf-token": document.cookie.match(
            /JSESSIONID="(ajax:\d+[^"]*)"/
          )?.[1],
          Cookie: document.cookie,
          Accept: "application/vnd.linkedin.normalized+json+2.1",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    const data = await res.json();

    const users = extractUserData(data);

    if (users.length === 0) {
      console.log("No likes found in this batch");
      return;
    }

    // logging data to the console
    console.log("Users who liked on this post:", users);
  } catch (error) {
    console.error("Error fetching data:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
  }
}

// Start of script
function getCommentId() {
  let commentContainer = document?.body?.querySelector(
    "div.feed-shared-update-v2__comments-container"
  );
  let commentList = commentContainer?.querySelector(
    "div.comments-comment-list__container"
  );
  let allComments = Array.from(
    commentList?.querySelectorAll(":scope > article.comments-comment-entity") ||
      []
  );
  let comment = allComments[0];
  const commentDataId = comment?.getAttribute("data-id");
  return commentDataId;
}

function extractUrnParts(urn) {
  const match = urn.match(/urn:li:comment:\(([^,]+),([^)]+)\)/);
  if (!match) return null;

  const [_, postUrn, commentId] = match;
  return {
    postUrn,
    commentId,
  };
}

function findTotolLIkes() {
  const span = document.querySelector(
    "span.social-details-social-counts__reactions-count"
  );
  const number = parseInt(span?.textContent.replace(/,/g, "").trim(), 10) || 0;
  return number;
}

async function fetchAllLikes() {
  const urn = getCommentId();

  const postUrn = extractUrnParts(urn);

  const totalLIkes = findTotolLIkes();
  const count = 100; // max 100 at a time
  let start = 0;
  const pages = Math.ceil(totalLIkes / count);

  for (let index = 0; index < pages; index++) {
    await fetchData(postUrn.postUrn, start, count);
    start += count;
  }

  if (allLikesArray.length > 0) {
    console.log("allLikesArray-", allLikesArray.length, allLikesArray);
  }
}

fetchAllLikes();
