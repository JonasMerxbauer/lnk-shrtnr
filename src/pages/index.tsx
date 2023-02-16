import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Link from "next/link";

const Home = ({ host }: { host: string | null }) => {
  // const hello = api.url.getUrl.useQuery({ slug: "test" });

  return (
    <>
      <Head>
        <title>lnk shrtnr</title>
        <meta name="description" content="Link shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black pt-16">
        <h1 className="bg-gradient-to-r from-[#12c2e9] via-[#c471ed] to-[#f64f59] bg-clip-text text-5xl font-bold lowercase text-white text-transparent lg:text-6xl">
          Link shortener
        </h1>
        <Form host={host} />
        <Examples host={host} />
      </main>
    </>
  );
};

export default Home;

type Data = { slug: string; url: string };

const Form = ({ host }: { host: string | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>({ mode: "all" });
  const [slug, setSlug] = useState("");

  const onSubmit = async (data: Data) => {
    setSlug(data.slug);

    await fetch("http://localhost:3000/api/set-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const validateSlug = async (value: string) => {
    const params = new URLSearchParams({ slug: value });

    const data = (await (
      await fetch("http://localhost:3000/api/get-url?" + params.toString())
    ).json()) as { url: string; slug: string };

    return !data.url;
  };

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="m-4 mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
      >
        <div className="sm:col-span-2">
          <div className="flex justify-between">
            <label
              htmlFor="url"
              className={
                "block text-lg font-medium text-white lg:text-2xl" +
                (errors.url ? " text-red-500" : "")
              }
            >
              Your link
            </label>
            {errors.url && (
              <span
                id="url-description"
                className="text-md text-red-500 lg:text-xl"
              >
                Format has to be http[s]://example.com
              </span>
            )}
          </div>
          <div className="mt-1">
            <input
              id="url"
              {...register("url", {
                required: true,
                pattern: /^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,3}/,
              })}
              type="url"
              autoComplete="url"
              className={
                "block h-full w-full rounded-lg border-2 border-zinc-300 py-4 px-6 font-bold shadow-sm sm:text-4xl" +
                (errors.url
                  ? " border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "")
              }
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="flex justify-between">
            <label
              htmlFor="slug"
              className={
                "block text-lg font-medium text-white lg:text-2xl" +
                (errors.slug ? " text-red-500" : "")
              }
            >
              URL
            </label>
            {errors.slug && (
              <span id="slug-description" className="text-xl text-red-500">
                Taken
              </span>
            )}
          </div>
          <div
            className={
              "text-md mt-1 flex w-full rounded-lg border-2 border-zinc-300 bg-white font-bold focus-within:border-blue-600 focus-within:shadow-sm sm:text-xl lg:px-6 lg:text-4xl [&>*]:py-4" +
              (errors.slug
                ? " border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                : "")
            }
          >
            <span className="">{host}</span>
            <input
              {...register("slug", {
                validate: (value: string) => validateSlug(value),
              })}
              id="slug"
              autoComplete="tel"
              aria-describedby="slug-description"
              className="text flex-1 font-bold focus:outline-none"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <input
            type="submit"
            value="SHORTEN"
            className="inline-flex w-full cursor-pointer justify-center rounded-lg border-zinc-300 border-transparent bg-[#c471ed] py-2 px-4 text-2xl font-bold text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          />
        </div>
      </form>
      {slug && <CopyLink slug={slug} host={host} />}
    </>
  );
};

const CopyLink = ({ slug, host }: { slug: string; host: string | null }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <span className="text-2xl font-bold text-white">Your link</span>
      <div className="flex w-fit items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 font-bold shadow-sm sm:text-4xl [&>*]:py-4">
        <div>{host ? host + slug : slug}</div>
        <div
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await navigator.clipboard.writeText(host ? host + slug : slug);
            setCopied(true);
          }}
          className="cursor-pointer"
        >
          {!copied && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path
                fillRule="evenodd"
                d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z"
                clipRule="evenodd"
              />
              <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
              <path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
            </svg>
          )}
          {copied && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path
                fillRule="evenodd"
                d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

const Examples = ({ host }: { host: string | null }) => {
  if (!host) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <span className="text-2xl font-bold text-white">Examples</span>
      <div className="flex w-fit flex-col gap-4 rounded-lg border border-zinc-300 bg-white p-6 font-bold shadow-sm sm:text-3xl">
        <Link href={`https://${host}seznam`}>https://{`${host}seznam`}</Link>
        <Link href={`https://${host}github`}>https://{`${host}github`}</Link>
        <Link href={`https://${host}linkedin`}>
          https://{`${host}linkedin`}
        </Link>
      </div>
    </div>
  );
};

interface Props {
  host: string;
}

export const getServerSideProps = ({ req }: GetServerSidePropsContext) => {
  return {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    props: { host: `${req.headers.host}/` },
  };
};
