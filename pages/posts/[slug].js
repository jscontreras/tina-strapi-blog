import { useCMS, useForm, usePlugin } from "tinacms";

import { CMS_NAME } from "../../lib/constants";
import Container from "../../components/container";
import ErrorPage from "next/error";
import Head from "next/head";
import Header from "../../components/header";
import { InlineForm } from "react-tinacms-inline";
import Layout from "../../components/layout";
import PostBody from "../../components/post-body";
import PostHeader from "../../components/post-header";
import PostTitle from "../../components/post-title";
import { fetchGraphql } from "react-tinacms-strapi";
import markdownToHtml from "../../lib/markdownToHtml";
import { useRouter } from "next/router";

export default function Post({ post: initialPost, morePosts, preview }) {
  const cms = useCMS();
  const formConfig = {
    id: initialPost.id,
    label: "Blog Post",
    initialValues: initialPost,
    onSubmit: async (values) => {
      const saveMutation = `
      mutation UpdateBlogPost(
        $id: ID!
        $title: String
        $content: String
        $coverImageId: ID
      ) {
        updateBlogPost(
          input: {
            where: { id: $id }
            data: { title: $title, content: $content, coverImage: $coverImageId}
          }
        ) {
          blogPost {
            id
          }
        }
      }`;
      const response = await fetchGraphql(saveMutation, {
        id: values.id,
        title: values.title,
        content: values.content,
        coverImageId: cms.media.store.getFileId(values.coverImage.url),
      });
    },
    fields: [],
  };
  const [post, form] = useForm(formConfig);
  usePlugin(form);

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta
                  property="og:image"
                  content={process.env.STRAPI_URL + post.coverImage.url}
                />
              </Head>
              <InlineForm form={form} initialStatus={"active"}>
              <PostHeader
                title={post.title}
                coverImage={process.env.STRAPI_URL + post.coverImage.url}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
              </InlineForm>
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  const postResults = await fetchGraphql(
    `
    query{
      blogPosts(where: {slug: "${params.slug}"}){
        id
        title
        date
        slug
        content
        author {
          name
          picture { 
            url
          }
        }
        coverImage {
          url
        }
      }
    }
  `
  );
  const post = postResults.data.blogPosts[0];

  if (preview) {
  return {
    props: {
      post: {
        ...post,
      },
        preview,
        ...previewData,
      },
    };
  }
  return {
    props: {
      post: {
        ...post,
      },
      preview: false,
    },
  };
}

export async function getStaticPaths() {
  const postResults = await fetchGraphql(
    `
    query{
      blogPosts{
        slug
      }
    }
  `
  );

  return {
    paths: postResults.data.blogPosts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
