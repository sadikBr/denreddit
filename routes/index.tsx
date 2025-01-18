type TopSectionProps = {
  message?: string;
};

function TopSection(props: TopSectionProps) {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <a href="/">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
        </a>
        <h1 class="text-4xl font-bold text-center">
          Den<span class="text-yellow-500">Reddit</span> - Reddit Clone
        </h1>
        <form class="w-[75vw] flex flex-col gap-1 lg:flex-row mt-8 bg-white rounded-md overflow-hidden p-1">
          <div class="flex items-center gap-4 flex-[2]">
            <select name="kind" class="px-1 py-2 uppercase">
              <option value="user">user</option>
              <option value="subreddit">subreddit</option>
            </select>
            <input
              type="text"
              name="searchTerm"
              placeholder="Search Input"
              class="flex-1 px-1 py-2 rounded-md"
            />
          </div>
          <div class="flex items-center gap-4 flex-1">
            <select name="sortType" class="px-1 py-2 uppercase">
              <option value="hot">hot</option>
              <option value="new">new</option>
              <option value="top">top</option>
            </select>
            <select name="sortPeriod" class="px-1 py-2 uppercase">
              <option value="all">all</option>
              <option value="week">week</option>
              <option value="day">day</option>
            </select>
            <input
              type="submit"
              value="Search"
              class="px-1 py-2 bg-yellow-500 flex-1 rounded-md cursor-pointer text-white font-extrabold uppercase"
            />
          </div>
        </form>
        {props.message && (
          <p class="text-red-400 text-sm mt-8">{props.message}</p>
        )}
      </div>
    </div>
  );
}

function SearchResults() {
  return (
    <div class="w-full flex items-center gap-4 py-4 overflow-x-auto">
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} class="flex flex-col gap-2 text-center">
          <div class="w-[90px] aspect-square bg-green-300 rounded-full flex flex-shrink-0 items-center justify-center">
            {index}
          </div>
          <p>Testing Name</p>
        </div>
      ))}
    </div>
  );
}

function SubredditPosts() {
  return (
    <div class="w-full columns-1 lg:columns-2">
      {Array.from({ length: 35 }).map((_, index) => (
        <div
          class={`w-full h-[700px] rounded-md bg-green-300 flex items-center justify-center mb-2`}
          key={index}
        >
          {index}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <TopSection />
      <div class="px-4 py-8 max-w-7xl mx-auto">
        <SearchResults />
        <SubredditPosts />
      </div>
    </>
  );
}
