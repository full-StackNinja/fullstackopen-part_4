const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
   const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
   return likes;
};

const favoriteBlog = (blogs) => {
   if (blogs.length === 0) return null;
   let blogWithMaxLikes = blogs[0];
   blogs.forEach((blog) => {
      if (blog.likes > blogWithMaxLikes.likes) {
         blogWithMaxLikes = blog;
      }
   });

   const { title, author, likes } = blogWithMaxLikes;
   return { title, author, likes };
};

const mostBlogs = (blogs) => {
   if (!blogs || blogs.length === 0) return null;
   const authorsWithBlogs = {};
   blogs.forEach((blog) => {
      authorsWithBlogs[blog.author] =
         authorsWithBlogs[blog.author] === undefined
            ? 1
            : authorsWithBlogs[blog.author] + 1;
   });
   let authorWithMaxBlogs = null;
   let blogsCount = 0;
   Object.keys(authorsWithBlogs).forEach((author) => {
      if (authorWithMaxBlogs === null) {
         authorWithMaxBlogs = author;
         blogsCount = authorsWithBlogs[author];
      } else if (blogsCount < authorsWithBlogs[author]) {
         authorWithMaxBlogs = author;
         blogsCount = authorsWithBlogs[author];
      }
   });

   return { author: authorWithMaxBlogs, blogs: blogsCount };
};

const mostLikes = (blogs) => {
   if (!blogs || blogs.length === 0) return null;

   let authorWithLikes = {};

   blogs.forEach((blog) => {
      authorWithLikes[blog.author] =
         authorWithLikes[blog.author] === undefined
            ? blog.likes
            : authorWithLikes[blog.author] + blog.likes;
   });
   let authorWithMostLikes = null;
   let totalLikes = 0;
   Object.keys(authorWithLikes).forEach((author) => {
      if (authorWithMostLikes === null) {
         authorWithMostLikes = author;
         totalLikes = authorWithLikes[author];
      } else if (totalLikes < authorWithLikes[author]) {
         authorWithMostLikes = author;
         totalLikes = authorWithLikes[author];
      }
   });

   return { author: authorWithMostLikes, likes: totalLikes };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
