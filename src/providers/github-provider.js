import React, { createContext, useState, useCallback } from "react";
import api from "../services/api.js";

export const GithubContext = createContext({
  loading: false,
  user: {},
  repositories: [],
  starred: [],
});

const GithubProvider = ({ children }) => {
  const [githubState, setgithubState] = useState({
    loading: false,
    user: {
      id: undefined,
      hasUser: false,
      avatar: undefined,
      login: undefined,
      name: undefined,
      html_url: undefined,
      blog: undefined,
      company: undefined,
      location: undefined,
      followers: 0,
      following: 0,
      public_gists: 0,
      public_repos: 0,
    },
    repositories: [],
    starred: [],
  });

  const getUser = (username) => {
    setgithubState((prevState) => ({
      ...prevState,
      loading: !prevState.loading,
    }));

    api
      .get(`users/${username}`)
      .then(({ data }) => {
        setgithubState((prevState) => ({
          ...prevState,
          hasUser: true,
          user: {
            id: data.id,
            avatar: data.avatar_url,
            login: data.login,
            name: data.name,
            html_url: data.html_url,
            blog: data.blog,
            company: data.company,
            location: data.location,
            followers: data.followers,
            following: data.following,
            public_gists: data.public_gists,
            public_repos: data.public_repos,
          },
        }));
      })
      .finally(() => {
        setgithubState((prevState) => ({
          ...prevState,
          loading: !prevState.loading,
        }));
      });
  };

  const getUserRepos = (username) => {
   
    api
      .get(`users/${username}/repos`)
      .then(({ data }) => {
        setgithubState((prevState) => ({
          ...prevState,
          
          repositories: data,
        }));
      })
      
  };

  const getUserStarred = (username) => {
   
    api
      .get(`users/${username}/starred`)
      .then(({ data }) => {
        setgithubState((prevState) => ({
          ...prevState,
          
          starred: data,
        }));
      })
      
  };

  const contexValue = {
    githubState,
    getUser: useCallback((username) => getUser(username), []),
    getUserRepos: useCallback((username) => getUserRepos(username), []),
    getUserStarred: useCallback((username) => getUserStarred(username), []),
  };

  return (
    <GithubContext.Provider value={contexValue}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubProvider;
