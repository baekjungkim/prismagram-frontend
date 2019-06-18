import React, { useState } from "react";
import AuthPresenter from "./AuthPresenter";
import { toast } from "react-toastify";
import { useMutation } from "react-apollo-hooks";
import useInput from "../../Hooks/useInput";
import {
  LOG_IN,
  CREATE_ACCOUNT,
  CONFIRM_SECRET,
  LOCAL_LOG_IN
} from "./AuthQueries";

export default () => {
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const secret = useInput("");
  const email = useInput("zvgandam@gmail.com");
  const requestSecretMutation = useMutation(LOG_IN, {
    variables: { email: email.value }
  });
  const createAccountMutation = useMutation(CREATE_ACCOUNT, {
    variables: {
      username: username.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value
    }
  });
  const confirmSecretMutation = useMutation(CONFIRM_SECRET, {
    variables: {
      secret: secret.value,
      email: email.value
    }
  });
  const localLogInMutation = useMutation(LOCAL_LOG_IN);

  const onSubmit = async e => {
    e.preventDefault();
    if (action === "logIn") {
      if (email.value !== "") {
        try {
          const {
            data: { requestSecret }
          } = await requestSecretMutation();
          if (!requestSecret) {
            toast.error("You don't have an account yet, create one");
            setTimeout(() => setAction("signUp"), 3000);
          } else {
            toast.success("Check you email for you login secret");
            setAction("confirm");
          }
        } catch {
          toast.error("Can't request secret, try again");
        }
      } else {
        toast.error("Email is required");
      }
    } else if (action === "signUp") {
      if (
        username.value !== "" &&
        firstName.value !== "" &&
        lastName.value !== "" &&
        email.value !== ""
      ) {
        try {
          const {
            data: { createAccount }
          } = await createAccountMutation();
          if (!createAccount) {
            toast.error("Can't create account");
          } else {
            toast.success("Account created! LogIn Now!");
            setTimeout(() => setAction("logIn"), 3000);
          }
        } catch (e) {
          toast.error(e.message);
        }
      } else {
        toast.error("All field are required");
      }
    } else if (action === "confirm") {
      if (secret.value !== "") {
        try {
          const {
            data: { confirmSecret: token }
          } = await confirmSecretMutation();
          if (token !== "" && token !== undefined) {
            localLogInMutation({ variables: { token } });
          } else {
            throw Error();
          }
        } catch {
          toast.error("Can't confirm secret, check Again");
        }
      }
    }
  };

  return (
    <AuthPresenter
      setAction={setAction}
      action={action}
      username={username}
      firstName={firstName}
      lastName={lastName}
      email={email}
      onSubmit={onSubmit}
      secret={secret}
    />
  );
};
