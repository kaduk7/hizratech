"use client"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";


const Login = () => {
  const [usernama, setUsernama] = useState("");
  const [password, setPassword] = useState("");
  const [st, setSt] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })



  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const login = await signIn('credentials', {
      usernama,
      password,
      redirect: false
    })
    if (login?.error) {
      Toast.fire({
        icon: 'warning',
        title: 'Username atau password salah'
      })
      return
    }
    else {
      Toast.fire({
        icon: 'success',
        title: 'Login Berhasil'
      })
      setTimeout(function () {
        // router.push('/')
        // window.location.reload()
      }, 1500);
    }
  };

  return (
    <div className="authincation h-100">
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-lg-6 col-md-12 col-sm-12 mx-auto align-self-center">
            <div className="login-form">
              <div className="text-center">
                <img src="/tema/images/logoawal2.png" width='500' height='150' className="mb-0" alt="" />
                {/* <h3 className="title">Selamat datang di Aplikasi iCerdas</h3> */}
                <p>Selamat datang di Website Hizratech </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-1 text-dark">Username</label>
                  <input
                    required
                    type="email"
                    className="form-control form-control"
                    onChange={(e) => setUsernama(e.target.value)}
                    placeholder="Username"
                  />
                </div>
                <div className="mb-4 position-relative">
                  <label className="mb-1 text-dark">Password</label>
                  <input
                    required
                    type={st ? "text" : "password"}
                    className="form-control form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"

                  />

                  <span className="show-pass eye">
                    {st ?
                      <a onClick={() => setSt(!st)} className="" >
                        <i className="mdi mdi-eye" />
                      </a>
                      :
                      <a onClick={() => setSt(!st)} className="" >
                        <i className="mdi mdi-eye-off" />
                      </a>
                    }
                  </span>
                </div>
                <div className="text-center mb-4">
                  <button type="submit" className="btn btn-primary light btn-block">
                    Sign In
                  </button>
                </div>


              </form>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="pages-left h-100">
              <div className="login-content">
                <p>

                </p>
              </div>
              <div className="login-media text-center">
                <img src="/tema/images/z.png" alt="" />
              </div>
              <div className="login-content">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login