// Function to extract user data from the API response
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

      // Extract profile picture URL (e.g., 200x200 size)
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

      users.push(userData);
    }
  });

  return users;
}

// Function to fetch reaction data
async function fetchData(userPostURN) {
  const postUrn = userPostURN.replaceAll(":", "%3A");
  const count = 100; // max 100 at a time
  const start = 0;
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

    console.log("Response received", data);
    const users = extractUserData(data);

    if (users.length === 0) {
      console.log("No user data extracted. Response structure may differ.");
      console.log("Raw response:", JSON.stringify(res.data, null, 2));
      return;
    }

    // logging data to the consol
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
const postURL =
  "https://www.linkedin.com/posts/yash-kumar-yadav-676709237_mongodb-mongodblocal-learningjourney-activity-7240296448490151936-6i7C/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADsMc3EBtjvELjPVNjgyqVdmM4Gyr8ovFYk" ||
  window.location.href;
const isUrnExist = postURL.includes("/feed/update/urn:li:activity:");
let postURN = "";

if (isUrnExist) {
  const postURlArr = postURL.split("/");
  postURN = postURlArr[postURlArr.length - 2];
} else {
  const match = postURL.match(/activity-(\d+)-/);
  const activityId = match ? match[1] : null;
  postURN = activityId ? `urn:li:activity:${activityId}` : null;
}

console.log("postURN-", postURN);

fetchData(postURN);
