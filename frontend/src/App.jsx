import { useState } from "react";
import API from "./api";

const StyledInput = ({ name, placeholder, onChange, type = "text" }) => (
  <div className="relative group">
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-300 shadow-sm group-hover:border-indigo-200"
    />
  </div>
);

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    university_name: "",
    gender: "",
    year_joined: "",
  });

  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showData, setShowData] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await API.post("/register", form);
      alert(res.data.message);
    } catch {
      alert("Register failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
    } catch {
      alert("Login failed");
    }
  };

  const fetchData = async () => {
    try {
      const usersRes = await API.get("/users");
      const teachersRes = await API.get("/teachers");
      setUsers(usersRes.data);
      setTeachers(teachersRes.data);
      setShowData(true);
    } catch {
      alert("Error fetching data");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-teal-50 flex items-center justify-center p-6 font-sans">
      
      <div className={`transition-all duration-500 ease-in-out bg-white/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] border border-white p-8 w-full ${showData ? 'max-w-4xl' : 'max-w-md'}`}>
        
        <div className={showData ? "grid grid-cols-1 md:grid-cols-2 gap-12" : "block"}>
          
          {/* Form Section */}
          <div className="flex flex-col justify-center">
            <header className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-500 mt-2">Please enter your details to continue</p>
            </header>

            <div className="space-y-4">
              <StyledInput name="email" placeholder="Email Address" onChange={handleChange} />

              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <StyledInput name="first_name" placeholder="First Name" onChange={handleChange} />
                  <StyledInput name="last_name" placeholder="Last Name" onChange={handleChange} />
                </div>
              )}

              <StyledInput name="password" type="password" placeholder="Password" onChange={handleChange} />

              {!isLogin && (
                <>
                  <StyledInput name="university_name" placeholder="University" onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <StyledInput name="gender" placeholder="Gender" onChange={handleChange} />
                    <StyledInput name="year_joined" placeholder="Year Joined" onChange={handleChange} />
                  </div>
                </>
              )}

              <button
                onClick={isLogin ? handleLogin : handleRegister}
                className="w-full py-3.5 mt-2 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-indigo-600 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                {isLogin ? "Sign In" : "Register Now"}
              </button>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
                </button>

                {isLogin && (
                  <button
                    onClick={fetchData}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-600 transition-all font-medium"
                  >
                    <span className="text-lg">⚡</span> Load System Data
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Data Tables Section */}
          {showData && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">👤</span>
                  <h3 className="font-bold text-slate-800">Recent Users</h3>
                </div>
                <div className="bg-white/50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Email Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-3 text-slate-400 font-mono text-xs">#{u.id}</td>
                          <td className="px-4 py-3 text-slate-700 text-sm font-medium">{u.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">🎓</span>
                  <h3 className="font-bold text-slate-800">Faculty Records</h3>
                </div>
                <div className="bg-white/50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">University</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teachers.map((t) => (
                        <tr key={t.id} className="hover:bg-teal-50/30 transition-colors">
                          <td className="px-4 py-3 text-slate-400 font-mono text-xs">#{t.id}</td>
                          <td className="px-4 py-3 text-slate-700 text-sm font-medium">{t.university_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;