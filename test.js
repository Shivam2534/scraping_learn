// function getCommentId() {
//   let commentContainer = document?.body?.querySelector(
//     "div.feed-shared-update-v2__comments-container"
//   );
//   let commentList = commentContainer?.querySelector(
//     "div.comments-comment-list__container"
//   );
//   let allComments = Array.from(
//     commentList?.querySelectorAll(":scope > article.comments-comment-entity") ||
//       []
//   );
//   console.log('allComments-',allComments[0])
//   let comment = allComments[0];
//   const commentDataId = comment?.getAttribute("data-id");
//   return commentDataId;
// }

// const id = getCommentId();


//////////////////
function extractLikersFromHtml(document) {
  const likers = [];
  const facepileItems = document.querySelectorAll('.social-details-reactors-facepile__list-item');

  facepileItems.forEach(item => {
    const link = item.querySelector('.social-details-reactors-facepile__profile-link');
    if (!link) return;

    const ariaLabel = link.getAttribute('aria-label') || '';
    const reactionMatch = ariaLabel.match(/reacted with (\w+)/);
    const reactionType = reactionMatch ? reactionMatch[1] : 'N/A';

    // Only include LIKE reactions
    if (reactionType !== 'LIKE') return;

    const nameMatch = ariaLabel.match(/View (.+?)’s/);
    const name = nameMatch ? nameMatch[1] : 'N/A';
    const profileUrl = link.getAttribute('href') || 'N/A';

    const img = item.querySelector('.social-details-reactors-facepile__actor-image');
    let profilePicture = img ? img.getAttribute('src') : 'N/A';
    // Handle ghost profile placeholder
    if (profilePicture.includes('data:image/gif')) {
      profilePicture = 'N/A';
    }

    likers.push({
      name,
      profile_url: profileUrl,
      profile_picture: profilePicture,
      reaction_type: reactionType
    });
  });

  return likers;
}

// Example usage
const doc = document.querySelectorAll('.update-v2-social-activity')[0]
const likers = extractLikersFromHtml(doc);
likers.forEach(liker => {
  console.log(`Name: ${liker.name}`);
  console.log(`Profile URL: ${liker.profile_url}`);
  console.log(`Profile Picture: ${liker.profile_picture}`);
  console.log(`Reaction Type: ${liker.reaction_type}`);
  console.log('-'.repeat(50));
});