"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const dynamic = 'force-dynamic'

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  isFeatured: boolean;
};

type Option = {
  title: string;
  additionalPrice: number;
};

const AddPage = () => {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
    isFeatured: false,
  });

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });

  const [options, setOptions] = useState<Option[]>([]);
  const [file, setFile] = useState<File>();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value, type, checked } = e.target;
  //   const val = type === "checkbox" ? checked : value;

  //   setInputs((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? !prev[name] : val,
  //   }));
  // };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
  
    // Check if the event target is an input element with type checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setInputs((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOption((prev) => ({
      ...prev,
      [name]: name === "additionalPrice" ? parseFloat(value) : value,
    }));
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", "restaurant"); // Replace with your upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/doheudo2p/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const data = await response.json();
      return data.url; // Assuming Cloudinary response contains the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const imageUrl = await upload();
 console.log(imageUrl)
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          img: imageUrl,
          ...inputs,
          options,
        }),
      });
console.log(response);
      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      router.push(`/product/${data.id}`);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  return (
    <div className="p-4 lg:px-20 xl:px-40 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-9rem)] flex items-center justify-center text-red-500">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-6 max-w-screen-md w-full">
        <h1 className="text-4xl mb-2 text-gray-300 font-bold w-full">
          Add New Product
        </h1>
        <div className="w-full flex flex-col gap-2 ">
          <label
            className="text-sm cursor-pointer flex gap-4 items-center"
            htmlFor="file"
          >
            <Image 
              src="/upload.png"
              alt=""
              width={30}
              height={20}
            /> 
            <span>Upload Image</span>
          </label>
          <input
            type="file"
            onChange={handleChangeImg}
            id="file"
            className="hidden"
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Title</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
            value={inputs.title}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Description</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            value={inputs.desc}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Price</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Category</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="pizzas"
            name="catSlug"
            value={inputs.catSlug}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Is Featured</label>
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="isFeatured" 
              checked={inputs.isFeatured} 
              onChange={handleChange} 
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            <span className="ms-3 text-sm font-medium text-red-900 dark:text-red-300">
              {inputs.isFeatured ? "Featured" : "Not Featured"}
            </span>
          </label>
        </div>
       
             <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Options</label>
          <div className="flex flex-col md:flex-row md:gap-2">
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none mb-2 md:mb-0"
              type="text"
              placeholder="Title"
              name="title"
              value={option.title}
              onChange={changeOption}
            />
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none mb-2 md:mb-0"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
              value={option.additionalPrice}
              onChange={changeOption}
            />
            <button
              type="button"
              className="bg-gray-500 p-2 text-white mt-2 md:mt-0 md:ml-2"
              onClick={() => {
                setOptions((prev) => [...prev, option]);
                setOption({ title: "", additionalPrice: 0 });
              }}
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {options.map((opt, index) => (
              <div
                key={index}
                className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
                onClick={() =>
                  setOptions((prev) =>
                    prev.filter((item) => item.title !== opt.title)
                  )
                }
              >
                <span>{opt.title}</span>
                <span className="text-xs"> (+ ₹{opt.additionalPrice})</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-red-500 p-4 text-white w-full rounded-md relative h-14 flex items-center justify-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPage;