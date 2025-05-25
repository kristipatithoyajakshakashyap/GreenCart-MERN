import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const InputFiled = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const { axios, user, navigate } = useAppContext();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);
  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputFiled
                handleChange={handleChange}
                address={address}
                name="firstName"
                text="text"
                placeholder="First Name"
              />
              <InputFiled
                handleChange={handleChange}
                address={address}
                name="lastName"
                text="text"
                placeholder="Last Name"
              />
            </div>
            <InputFiled
              handleChange={handleChange}
              address={address}
              name="email"
              text="text"
              placeholder="Email address"
            />
            <InputFiled
              handleChange={handleChange}
              address={address}
              name="street"
              text="text"
              placeholder="Street"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputFiled
                handleChange={handleChange}
                address={address}
                name="city"
                text="text"
                placeholder="City"
              />
              <InputFiled
                handleChange={handleChange}
                address={address}
                name="state"
                text="text"
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputFiled
                handleChange={handleChange}
                address={address}
                name="zipcode"
                text="text"
                placeholder="Zip Code"
              />
              <InputFiled
                handleChange={handleChange}
                address={address}
                name="country"
                text="text"
                placeholder="Country"
              />
            </div>
            <InputFiled
              handleChange={handleChange}
              address={address}
              name="phone"
              text="text"
              placeholder="Phone"
            />
            <button className="w-full mt-6 py-3 bg-primary text-white hover:bg-primary-dull transition cursor-pointer uppercase rounded">
              Save Address
            </button>
          </form>
        </div>
        <img
          src={assets.add_address_iamge}
          alt="Add Address"
          className="md:mr-16 mb-16 mb:mt-0"
        />
      </div>
    </div>
  );
};

export default AddAddress;
