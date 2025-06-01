"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import GithubCard from "./components/GithubCard";

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

const schema = z.object({
  username: z.string().min(1, "Enter a username")
});

type FormData = z.infer<typeof schema>;

export default function GitHubExplorer() {
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [repos, setRepos] = useState<Record<string, GithubRepo[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const fetchUsers = async (data: FormData) => {
    setLoadingUsers(true);
    setError(null);
    setUsers([]);
    setRepos({});
    setExpanded(null);

    try {
      const res = await axios.get(
        `https://api.github.com/search/users?q=${data.username}&per_page=5`
      );
      setUsers(res.data.items);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to fetch users. Try again later.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUser = async (username: string) => {
    if (expanded === username) {
      setExpanded(null);
      return;
    }

    if (!repos[username]) {
      setLoadingRepos(username);
      try {
        const res = await axios.get(`https://api.github.com/users/${username}/repos`);
        setRepos(prev => ({ ...prev, [username]: res.data }));
      } catch {
        setError("Failed to fetch repositories.");
      } finally {
        setLoadingRepos(null);
      }
    }

    setExpanded(username);
  };

  return (
    <div className="w-full p-4 flex justify-center items-start">
      <div className="container space-y-4 py-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-white mb-12">GitHub Mini Explorer</h1>
        <form onSubmit={handleSubmit(fetchUsers)} className="flex flex-col gap-2">
          <input
            {...register("username")}
            placeholder="Enter username"
            className="p-2 rounded border border-gray-300 text-white"
          />
          {errors.username && (
            <span className="text-sm text-red-500">{errors.username.message}</span>
          )}
          <button
            type="submit"
            className="bg-gray-500 text-white rounded py-2 hover:bg-gray-600"
          >
            {loadingUsers ? "Loading..." : "Search"}
          </button>
        </form>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {users.map(user => (
          <GithubCard 
            key={user.login}
            user={user}
            toggleUser={toggleUser}
            expanded={expanded}
            repos={repos}
            loadingRepos={loadingRepos}
          />
          // <div key={user.login} className="bg-gray-100 rounded shadow p-2">
          //   <button
          //     onClick={() => toggleUser(user.login)}
          //     className="w-full text-left flex justify-between items-center"
          //   > 
          //     <div className="flex items-center justify-between">
          //       <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-full mr-2 border border-gray-300" />
          //       <span className="text-lg font-semibold text-gray-800 ml-2">
          //         {user.login}
          //       </span>
          //     </div>
          //     <span>{expanded === user.login ? "▲" : "▼"}</span>
          //   </button>
          //   {expanded === user.login && (
          //     <motion.div
          //       initial={{ height: 0, opacity: 0 }}
          //       animate={{ height: "auto", opacity: 1 }}
          //       className="overflow-hidden mt-2"
          //     >
          //       {loadingRepos === user.login ? (
          //         <p>Loading repos...</p>
          //       ) : (
          //         repos[user.login].length > 0 
          //         ? repos[user.login]?.map(repo => (
          //           <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block" key={repo.id}>
          //             <div className="border mt-1 p-2 rounded text-sm bg-gray-50">
          //               <div className="font-semibold flex justify-between">
          //                 {repo.name}
          //                 <span className="flex items-center gap-1">
          //                   {repo.stargazers_count}
          //                   <FaStar className="text-yellow-500" />
          //                 </span>
          //               </div>
          //               <div className="text-gray-600">{repo.description}</div>
          //             </div>
          //           </a>
          //         ))
          //         : <p className="text-gray-600 text-center">No repositories found.</p>
          //       )}
          //     </motion.div>
          //   )}
          // </div>
        ))}
      </div>
    </div>
  );
}
