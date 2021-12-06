import { useRouter } from "next/router";
import React, { useState } from "react";
import NoticeContainer from "../../../components/Board/Notice/NoticeContainer";
import Link from "next/link";

const Test = ({ post }) => {
  const router = useRouter().query;
  const UserLink = ({ id }) => (
    <Link href="/[writeBoardContainer]/writeBoard" as={`${id}/writeBoard`}>
      <a className="ml-auto w-32 align-middle border-2 rounded-xl flex items-center space-x-4 justify-center bg-blue-400">
        <div className="font-extrabold text-white">글쓰기</div>
      </a>
    </Link>
  );
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  console.log(post);
  return (
    <div className="flex h-screen place-items-center flex-col">
      <div className="w-3/4 h-9 flex m-5">
        <div className="flex-none ml-16 text-4xl">공지사항</div>
        <UserLink id="noticeBoard" comment="글쓰기"></UserLink>
      </div>
      <NoticeContainer />
    </div>
  );
};
// export async function getStaticPaths() {
//   const res = await fetch("http://localhost:5000/api/post/getPosts");
//   const posts = await res.json();
//   const paths = posts.map((post) => ({
//     params: { id: post.index },
//   }));
//   return { paths, fallback: true };
// }
// export async function getStaticProps({ params }) {
//   const res = await fetch("http://localhost:5000/api/post/getPosts");
//   const post = await res.json();
//   return {
//     props: {
//       post,
//     },
//   };
// }

export default Test;