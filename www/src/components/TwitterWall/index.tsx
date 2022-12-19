import React from 'react';
import { tweets } from './script.output';

const knownGithubProfiles: Record<string, string> = {
  t3dotgg: 't3dotgg',
};

const latestTweets = tweets.data
  // Attach user to each tweet & replace profile image with github profile image
  .map((tweet) => {
    const user = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...tweets.includes.users.find((user) => user.id === tweet.author_id)!,
    };
    const githubProfile = knownGithubProfiles[user.username];

    if (githubProfile) {
      user.profile_image_url = `https://github.com/${githubProfile}.png`;
    }
    return {
      ...tweet,
      url: `https://twitter.com/${user.username}/status/${tweet.id}`,
      user,
    };
  })
  // Skip displaying ugly Twitter-links
  .map((tweet) => {
    let text = tweet.text;
    tweet.entities.urls?.forEach((url) => {
      if (
        url.display_url.startsWith('twitter.com') ||
        url.display_url.startsWith('pic.twitter.com')
      ) {
        // Delete some twitter links - replies etc
        text = text.replace(url.url, '');
        return;
      }
      text = text.replace(url.url, url.display_url);
    });
    text = text.trim();
    return {
      ...tweet,
      text,
    };
  })
  // Sort by follower count
  .sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count)
  .slice(0, 12);

export const TwitterWall = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 my-6 rounded-xl">
      {latestTweets.map((tweet) => (
        <a
          href={tweet.url}
          key={tweet.id}
          className="p-6 transition-colors rounded-lg dark:bg-zinc-800/50 bg-zinc-100 hover:bg-zinc-200 hover:dark:bg-zinc-700/50 hover:no-underline"
        >
          <figure>
            <figcaption className="flex items-center justify-between">
              <a
                href={`https://twitter.com/${tweet.user.username}`}
                className="cursor-pointer hover:underline"
              >
                <div className="flex items-center gap-3 group">
                  <img
                    src={tweet.user.profile_image_url}
                    alt={tweet.user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <cite className="group-hover:underline not-italic">
                    <p className="text-base font-bold">{tweet.user.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      @{tweet.user.username}
                    </p>
                  </cite>
                </div>
              </a>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <time dateTime={new Date(tweet.created_at).toJSON()}>
                  {new Date(tweet.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </figcaption>

            <blockquote
              className="pt-4 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400 border-none pl-0"
              cite={tweet.url}
            >
              {tweet.text}
            </blockquote>
          </figure>
        </a>
      ))}
    </div>
  );
};
