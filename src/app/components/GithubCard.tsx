"use client";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
}

export default function GithubCard({ user, toggleUser, expanded, repos, loadingRepos }: {
  user: GithubUser;
  toggleUser: (login: string) => void;
  expanded: string | null;
  repos: Record<string, GithubRepo[]>;
  loadingRepos: string | null;
}) {
  return (
    <div className="bg-gray-100 rounded shadow p-2">
      <button
        onClick={() => toggleUser(user.login)}
        className="w-full text-left flex justify-between items-center"
      > 
        <div className="flex items-center justify-between">
          <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-full mr-2 border border-gray-300" />
          <span className="text-lg font-semibold text-gray-800 ml-2">
            {user.login}
          </span>
        </div>
        <span>{expanded === user.login ? "▲" : "▼"}</span>
      </button>
      {expanded === user.login && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden mt-2"
        >
          {loadingRepos === user.login ? (
            <p>Loading repos...</p>
          ) : (
            repos[user.login].length > 0 
            ? repos[user.login]?.map(repo => (
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block" key={repo.id}>
                <div className="border mt-1 p-2 rounded text-sm bg-gray-50">
                  <div className="font-semibold flex justify-between">
                    {repo.name}
                    <span className="flex items-center gap-1">
                      {repo.stargazers_count}
                      <FaStar className="text-yellow-500" />
                    </span>
                  </div>
                  <div className="text-gray-600">{repo.description}</div>
                </div>
              </a>
            ))
            : <p className="text-gray-600 text-center">No repositories found.</p>
          )}
        </motion.div>
      )}
    </div>
  )
}