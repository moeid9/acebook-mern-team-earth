import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Post = ({ post }) => {
  const formattedDate = formatDistanceToNow(new Date(2023 - 3 - 7), {
    addSuffix: true,
  });
  return (
    <article data-cy="post" key={post._id}>
      {post.message}
      Published {formattedDate}
    </article>
  );
};

export default Post;
