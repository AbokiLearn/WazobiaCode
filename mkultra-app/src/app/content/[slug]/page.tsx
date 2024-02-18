// app/content/[slug]/page.tsx
import { format, parseISO } from 'date-fns';
import { allPosts, Post } from 'contentlayer/generated';

// export const generateStaticParams = async () => allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

// export const generateMetadata = ({ params }: { params: { slug: string } }) => {
//   const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)
//   if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

//   return {
//     title: post.title,
//     author: post.author,
//   }
// }

type props = {
  params: { slug: string };
};

export default function PostLayout({ params }: props) {
  const url = `/content/${params.slug}`;
  const post = allPosts.find((post) => post.url === url);

  console.log(allPosts);

  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <h3 className="text-xl font-semibold">{`Author: ${post.author}`}</h3>
      </div>
      <div
        className="[&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </article>
  );
}
