import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton, FormField } from "../components";

import { useStateContext } from "../context";
import { money } from "../src/assets";
import { checkIfImage } from "../utils";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected, connect, isConnecting, createCampaign } =
    useStateContext();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleformFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        try {
          // `createCampaign` handles parsing `target` for the installed ethers version.
          await createCampaign(form);
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: "" }); 
      }
    })


    console.log(form);
  };

  if (!address || !isConnected) {
    return (
      <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[35px] text-white">
            Connect your wallet to create a campaign
          </h1>
        </div>
        <div className="mt-8">
          <CustomButton
            btnType="button"
            title={isConnecting ? "Connecting..." : "Connect MetaMask"}
            styles="bg-[#8c6dfd]"
            handleClick={() => connect?.().catch((err) => console.error(err))}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#1c1c24] flex justify-center
        items-center flex-col rounded-[10px] sm:p-10 p-4"
    >
      {isLoading && "Loader..."}
      <div
        className="flex justify-center items-center p-[16px]
            sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]"
      >
        <h1
          className="font-epilogue font-bold sm:text-[25px]
                 text-[18px] leading-[35px] text-white"
        >
          Start a Campaign
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px]
        flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name"
            placeholder="Sharon Emmanuel"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleformFieldChange("name", e)}
          />
          <FormField
            labelName="Campaign Title"
            placeholder="Write a Title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleformFieldChange("title", e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your Story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleformFieldChange("description", e)}
        />
        <div
          className="w-full flex justify-start items-center
            p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]"
        >
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] 
                  object-contain"
          />
          <h4
            className="font-epilogue font-bold text-[25px]
                  text-white ml-[20px]"
          >
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleformFieldChange("target", e)}
          />
          <FormField
            labelName="End Date "
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleformFieldChange("deadline", e)}
          />
        </div>

        <FormField
          labelName="Campaign Image"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleformFieldChange("image", e)}
        />
        <div
          className="flex justify-center 
          items-center mt-[40px]"
        >
          <CustomButton
            btnType="submit"
            title="Create Campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
