import React from 'react';

export const SponsorButton = () => {
  return (
    <a
      id="sponsor-button"
      href="https://github.com/sponsors/KATT"
      className="h-12 flex items-center gap-4 dark:bg-zinc-800 px-8 py-4 w-max rounded-lg group hover:dark:bg-zinc-900 border-2 dark:border-zinc-900 hover:dark:border-zinc-700 bg-zinc-200 hover:bg-zinc-100"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 aspect-square group-hover:scale-110 transition-transform duration-200 ease-in fill-[#EA4AAA]"
      >
        <path d="M17.625 1.499c-2.32 0-4.354 1.203-5.625 3.03-1.271-1.827-3.305-3.03-5.625-3.03C3.129 1.499 0 4.253 0 8.249c0 4.275 3.068 7.847 5.828 10.227a33.14 33.14 0 0 0 5.616 3.876l.028.017.008.003-.001.003c.163.085.342.126.521.125.179.001.358-.041.521-.125l-.001-.003.008-.003.028-.017a33.14 33.14 0 0 0 5.616-3.876C20.932 16.096 24 12.524 24 8.249c0-3.996-3.129-6.75-6.375-6.75zm-.919 15.275a30.766 30.766 0 0 1-4.703 3.316l-.004-.002-.004.002a30.955 30.955 0 0 1-4.703-3.316c-2.677-2.307-5.047-5.298-5.047-8.523 0-2.754 2.121-4.5 4.125-4.5 2.06 0 3.914 1.479 4.544 3.684.143.495.596.797 1.086.796.49.001.943-.302 1.085-.796.63-2.205 2.484-3.684 4.544-3.684 2.004 0 4.125 1.746 4.125 4.5 0 3.225-2.37 6.216-5.048 8.523z" />
      </svg>
      <span className="dark:text-zinc-300 text-zinc-900 no-underline font-semibold">
        Sponsor
      </span>
    </a>
  );
};
