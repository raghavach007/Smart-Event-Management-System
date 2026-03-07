import { useState } from "react";
import axios from "axios";

export default function Arena() {

  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    department: "",
    year: "",
    phone: "",
    email: "",
    sport: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitForm = async () => {
    try {
      await axios.post("http://localhost:8080/arena/register", form);

      alert("Registration Successful!");

      // Reset form
      setForm({
        name: "",
        rollNo: "",
        department: "",
        year: "",
        phone: "",
        email: "",
        sport: ""
      });

    } catch (error) {
      alert("Registration Failed!");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-10 gap-4">

      <h2 className="text-3xl font-bold">Arena Sports Registration</h2>

      <select
        name="sport"
        value={form.sport}
        onChange={handleChange}
        className="border p-2 w-64"
      >
        <option value="">Select Sport</option>
        <option value="Football">Football</option>
        <option value="Cricket">Cricket</option>
        <option value="Basketball">Basketball</option>
        <option value="Volleyball">Volleyball</option>
        <option value="Badminton">Badminton</option>
      </select>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-64"
      />

      <input
        name="rollNo"
        placeholder="Roll Number"
        value={form.rollNo}
        onChange={handleChange}
        className="border p-2 w-64"
      />

      <input
        name="department"
        placeholder="Department"
        value={form.department}
        onChange={handleChange}
        className="border p-2 w-64"
      />

      <input
        name="year"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        className="border p-2 w-64"
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="border p-2 w-64"
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-64"
      />

      <button
        onClick={submitForm}
        className="bg-black text-white px-6 py-2 mt-2"
      >
        Register
      </button>

    </div>
  );
}