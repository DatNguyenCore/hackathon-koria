import React from "react";
import HeaderIcon from "../Header/HeaderIcon";
import { Heart } from "../Header/HeaderIcons";

export default function ActivityCollection() {
  return (
    <div className="dropdown inline-block relative">
      <HeaderIcon Icon={Heart} name="Likes" />
      <ul className="dropdown-menu absolute hidden text-gray-700 pt-1 w-[300px] shadow-md left-3">
        <li className="">
          <a
            className="rounded-t bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap"
            href="#"
          >
            joel_mott likes your post.
          </a>
        </li>
        <li className="">
          <a
            className="bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap"
            href="#"
          >
            tatiana_pavlova like your post.
          </a>
        </li>
        <li className="">
          <a
            className="rounded-b bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap"
            href="#"
          >
            huston_wilson like your post.
          </a>
        </li>
        <li className="">
          <a
            className="rounded-b bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap"
            href="#"
          >
            ayo_ogunseinde like your post.
          </a>
        </li>
        <li className="">
          <a
            className="rounded-b bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap"
            href="#"
          >
            thai_hoang like your post.
          </a>
        </li>
      </ul>
    </div>
  );
}
