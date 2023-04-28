import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { db, storage } from "../../helpers/firebase-config";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const New = () => {
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionImage, setCollectionImage] = useState("");
  const [collectionImagePreview, setCollectionImagePreview] = useState("");
  const [collectionCategory, setCollectionCategory] = useState("Art");
  const [collectionAddress, setCollectionAddress] = useState("");
  const router = useRouter();
  const { address } = useAccount();

  const createCollectionHandler = async () => {
    if (!address || !collectionAddress) return;
    //check if collection with this collectionAddress already exists
    const q = query(
      collection(db, "collections"),
      where("collectionAddress", "==", collectionAddress)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      alert("Collection with this address already exists");
      return;
    }

    // add in firebase v9 storage
    let fileUrl = "";
    if (collectionImage) {
      const storageRef = ref(storage, `collections/${collectionImage.name}`);
      await uploadBytes(storageRef, collectionImage);
      fileUrl = await getDownloadURL(storageRef);
    }

    // add in firestore
    const collectionRef = collection(db, "collections");
    const payload = {
      name: collectionName,
      description: collectionDescription,
      image: fileUrl || "",
      category: collectionCategory,
      creator: address,
      createdAt: new Date().getTime(),
      collectionAddress: collectionAddress,
      nfts: [],
    };
    console.log(payload);
    const docRef = await addDoc(collectionRef, payload);
    setCollectionName("");
    setCollectionDescription("");
    setCollectionImage("");
    setCollectionImagePreview("");
    setCollectionCategory("");
    router.push({
      pathname: "/create",
      query: { colectionAddr: collectionAddress },
    });
    setCollectionAddress("");
    console.log("Document written with ID: ", docRef.id);
  };
  console.log("collectioncategory", collectionCategory);
  return (
    <div className="px-4 pt-[80px] lg:pt-[150px] flex justify-center mb-6">
      {/* Form Section */}
      <div className="flex flex-col justify-center gap-10 items-center w-full lg:w-[50%]">
        <h1 className="conflux-text text-center text-3xl lg:text-5xl lg:mb-10 ">
          Sell your NFTs to the Nitfee Market
        </h1>
        {/* image preview */}
        <div className="w-full h-[150px] lg:h-[300px] bg-[#696969] rounded-lg flex justify-center items-center">
          {collectionImagePreview ? (
            // remove previously uploaded img omn click
            <img
              src={collectionImagePreview}
              alt=""
              className="w-full h-full object-cover rounded-lg"
              onClick={() => {
                setCollectionImage("");
                setCollectionImagePreview("");
              }}
            />
          ) : (
            // <p className="text-white text-2xl">Image Preview</p>
            // upload image when clicked on image preview
            <label
              htmlFor="collectionImage"
              className="w-full h-full flex justify-center items-center cursor-pointer"
            >
              <p className="text-white text-2xl">Upload Image</p>
            </label>
          )}
        </div>
        {/* image upload */}
        <label
          htmlFor="collectionImage"
          className="w-full p-4 hidden rounded border border-[#696969] bg-transparent outline-none text-white text-center cursor-pointer"
        >
          Upload Image
          <input
            type="file"
            name="collectionImage"
            id="collectionImage"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              setCollectionImage(e.target.files[0]);
              setCollectionImagePreview(
                e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : ""
              );
            }}
          />
        </label>

        <input
          type="text"
          name="contractAddress"
          placeholder="Collection Name"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        {/* collection contract address */}
        <input
          type="text"
          name="contractAddress"
          placeholder="Collection Contract Address"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={collectionAddress}
          onChange={(e) => setCollectionAddress(e.target.value)}
        />

        {/* collection description */}
        <textarea
          name="collectionDescription"
          placeholder="Collection Description"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={collectionDescription}
          onChange={(e) => setCollectionDescription(e.target.value)}
        />
        <select
          name="category"
          id="category"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={collectionCategory}
          onChange={(e) => setCollectionCategory(e.target.value)}
        >
          <option value="Art">Art</option>
          <option value="Gaming">Gaming</option>
          <option value="Sports">Sports</option>
          <option value="Photography">Photography</option>
          <option value="Music">Music</option>
          <option value="Virtual Worlds">Virtual Worlds</option>
        </select>
        <button
          className="walletConnectButton px-[36px] py-3 rounded-xl text-white mb-10"
          onClick={createCollectionHandler}
        >
          Create Collection
        </button>
      </div>
    </div>
  );
};
export default New;
