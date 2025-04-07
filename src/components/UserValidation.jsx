import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validUsers = {
  "Ghushit Kumar Chutia": "12306241",
  "Manasvi Sharma": "12310706",
  Umang: "12305833",
};

const UserValidation = () => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (validUsers[name] === regNo) {
      navigate("/Home");
    } else {
      setError("Invalid Name or Registration Number");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div
        className='flex flex-col h-[400px] w-[400px] md:h-[600px] md:w-[600px] bg-[#0d0d0d] p-6 text-white rounded-[40px] shadow-[0px_0px_100px_rgba(255,255,255,0.5)]
'
      >
        <h2 className='text-xl md:text-3xl font-semibold mt-7 md:mt-14 text-center tracking-wide font-mono '>
          USER VALIDATION
        </h2>
        <form className='flex flex-col p-8' onSubmit={handleSubmit}>
          <div className='mb-6 md:mb-12'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full py-2 md:py-5 pl-2 text-white border-b md:text-xl border-white hover:border-red-500 focus:outline-none focus:ring-0'
              placeholder='Name'
            />
          </div>
          <div className='mb-6 md:mb-12'>
            <input
              type='text'
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className='w-full py-2 md:py-5 pl-2 text-white border-b md:text-xl border-white hover:border-red-500 focus:outline-none focus:ring-0'
              placeholder='Registration Number'
            />
          </div>
          {error && (
            <p className='text-red-500 md:text-xl font-mono text-center'>
              {error}
            </p>
          )}
          <button
            type='submit'
            className='w-full py-2 md:py-4 mt-5 md:mt-10 bg-white hover:bg-red-500 focus:outline-none cursor-pointer text-black hover:text-white font-bold font-mono rounded-[20px] text-xl'
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserValidation;
