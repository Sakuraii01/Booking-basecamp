"use client";
import { Formik, Form } from "formik";
import { TextField } from "@mui/material";
import { fetchApi } from "@/src/utils/api";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
    <div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white p-6 rounded-3xl shadow-md w-80"
      >
        <div className="mb-3">
          <p className="text-xl font-semibold">Login as admin</p>
          <p className="text-sm">Booking</p>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await fetchApi(
              "/api/auth/login",
              {
                method: "POST",
              },
              {
                email: values.email,
                password: values.password,
              }
            ).then(async (res) => {
              if (res.status === 200) {
                router.push("/admin/dashboard");
              } else {
                alert("Login failed");
              }
            });
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <TextField
                fullWidth
                margin="dense"
                label="อีเมล"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                margin="dense"
                label="รหัสผ่าน"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <button
                type="submit"
                className="mt-5 bg-linear-to-r from-primary-1 to-primary-3 text-white 
                          px-4 py-3 rounded-full w-full z-10 shadow"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
