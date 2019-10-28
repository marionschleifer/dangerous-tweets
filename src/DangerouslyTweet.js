import React from "react";

import TweetStatus from "./TweetStatus";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const ADD_TWEET = gql`
  mutation($raw: String!) {
    insert_tweets(objects: [{ raw: $raw }]) {
      returning {
        id
      }
    }
  }
`;

const DangerouslyTweet = () => {
  let input;
  const [addTweet, { data, loading, error }] = useMutation(ADD_TWEET);

  if (data) {
    /* return (<span>Dispatched!</span>); */
    return <TweetStatus id={data.insert_tweets.returning[0].id} />;
  }
  if (loading) {
    return <span>Loading...</span>;
  }
  if (error) {
    return <span>{error.toString()}</span>;
  }
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTweet({ variables: { raw: input.value } });
        input.value = "";
      }}
    >
      <textarea
        style={{ fontSize: "calc(10px + 2vmin)" }}
        ref={node => {
          input = node;
        }}
      />
      <br />
      <button
        style={{ fontSize: "calc(10px + 2vmin)", padding: "10px" }}
        type="submit"
      >
        __dangerouslyTweet()
      </button>
    </form>
  );
};

export default DangerouslyTweet;
