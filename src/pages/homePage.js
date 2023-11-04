import React from 'react'

/* INTERACTIVE COMPONENTS */
import PostCard from '../components/postCard'

const HomePage = () => {
  return (
    <div class = "bodyContent">
      <div class = "headingFrame">
            <h2>Trending Bits</h2>
      </div>
      <div class = "divider" ></div>
      <div class = "postsFrame">
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
          <PostCard/>
      </div>
    </div>
  );
}

export default HomePage