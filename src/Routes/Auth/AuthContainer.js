import React, { useState } from "react";
import AuthPresenter from "./AuthPresenter";
import { toast } from "react-toastify";
import { useMutation } from "react-apollo-hooks";
import useInput from "../../Hooks/useInput";
import { LOG_IN, CREATE_ACCOUNT } from "./AuthQueries";

export default () => {
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
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

  const onSubmit = async e => {
    e.preventDefault();
    if (action === "logIn") {
      if (email.value !== "") {
        try {
          const { requestSecret } = await requestSecretMutation();
          if (!requestSecret) {
            toast.error("You don't have an account yet, create one");
            setTimeout(() => setAction("signUp"), 3000);
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
          const { createAccount } = await createAccountMutation();
          console.log(createAccount);
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
      requestSecret={requestSecretMutation}
    />
  );
};
