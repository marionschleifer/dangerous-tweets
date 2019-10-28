import React from "react";

import gql from "graphql-tag";
import { useSubscription } from "@apollo/react-hooks";

const TWEET_STATUS = gql`
  subscription tweetStatus($id: uuid!) {
    tweets(where: { id: { _eq: $id } }) {
      id
      sanitized
    }
  }
`;

const TweetStatus = ({ id }) => {
  const { data, loading, error } = useSubscription(TWEET_STATUS, {
    variables: { id }
  });

  if (loading) {
    return <span>Loading...</span>;
  }
  if (error) {
    return <span>{error.toString()}</span>;
  }

  if (!data || !data.tweets[0].sanitized) {
    return (
      <span>
        <img
          alt="cleaning"
          src="https://i.giphy.com/media/TG9ko7uVhkkde2eVAU/giphy.webp"
        />
      </span>
    );
  }

  if (data && data.tweets[0].sanitized) {
    const sanitized = data.tweets[0].sanitized;
    return (
      <div>
        {sanitized}
        <br />
        <br />
        <img
          alt="innocent"
          src="https://i.giphy.com/media/l3nSxBDg5obIiU9Ko/giphy.webp"
        />
      </div>
    );
  }
};

export default TweetStatus;
