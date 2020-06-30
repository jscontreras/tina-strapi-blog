import { InlineImage, InlineText } from "react-tinacms-inline";

import Avatar from "../components/avatar";
import CoverImage from "../components/cover-image";
import DateFormater from "../components/date-formater";
import PostTitle from "../components/post-title";
import { useCMS } from "tinacms";

export default function PostHeader({ title, coverImage, date, author }) {
  const cms = useCMS();
  return (
    <>
      <PostTitle>
        <InlineText name="title" />
      </PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar
          name={author.name}
          picture={process.env.STRAPI_URL + author.picture.url}
        />
      </div>
      <div className="mb-8 md:mb-16 -mx-5 sm:mx-0">
        <InlineImage
          name="coverImage.url"
          previewSrc={(formValues) => {
            process.env.STRAPI_URL +
              cms.media.store.getFilePath(formValues.coverImage.url);
          }}
          uploadDir={() => "/uploads"}
          parse={(filename) => {
            return `/uploads/${filename}`;
          }}
        >
          {() => <img src={coverImage} alt={`Cover Image for ${title}`} />}
        </InlineImage>{" "}
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar
            name={author.name}
            picture={process.env.STRAPI_URL + author.picture.url}
          />
        </div>
        <div className="mb-6 text-lg">
          <DateFormater dateString={date} />
        </div>
      </div>
    </>
  );
}
