"use client";
import {
  Box,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import NumberField from "../component/field/numberField";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { DatePicker, DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import { Formik, Form } from "formik";

import useViewModel from "./viewModel";
import { fetchApi } from "@/src/utils/api";
import { bookingSchema } from "./validation";
import { Header } from "../component/header";

import { useRouter } from "next/navigation";

function SSRInitialFilled(_: BaseNumberField.Root.Props) {
  return null;
}
SSRInitialFilled.muiName = "Input";

const BookingPage = () => {
  const {
    isSubmit,
    rooms,
    bookedTimes,
    loading,
    fetchBookedTimes,
    handleChangeIsSubmit,
    handleChangeLoading,
  } = useViewModel();

  const router = useRouter();

  return (
    <div>
      <Header header={"จองห้องประชุม"} />
      {isSubmit ? (
        <div className="fixed left-0 top-0 w-full h-full bg-black/30 z-50 backdrop-blur-sm">
          <div className="text-center absolute left-1/2 top-1/2 transform -translate-1/2 p-4 w-72 bg-white rounded-3xl">
            <h1 className="text-2xl font-semibold text-neutral-700">
              Just one more step!
            </h1>
            <img
              src="./logo-with-mail.png"
              className="h-48 mx-auto mt-10 mb-5"
            />
            <p className="text-sm font-semibold text-neutral-500">
              Your room is almost ready!
            </p>
            <p className="text-xs text-neutral-500">
              To finish booking, please open the email we just sent and click
              Confirm Booking.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 border-2 border-primary-1 rounded-full py-2 w-full text-neutral-800"
            >
              Back to home
            </button>
          </div>
        </div>
      ) : null}

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <section className="w-11/12 mx-auto px-4 pb-4 pt-6 my-5 bg-white rounded-3xl">
        <Formik
          initialValues={{
            date: null,
            startTime: null,
            endTime: null,
            name: "",
            company: "",
            email: "",
            tel: "",
            roomId: "",
            numberOfAttendees: 1,
            details: "",
          }}
          validationSchema={bookingSchema}
          onSubmit={async (values) => {
            handleChangeLoading(true);
            await fetchApi(
              "/api/room_schedule",
              {
                method: "POST",
              },
              {
                date: dayjs(values.date).toISOString(),

                startTime: dayjs(values.date)
                  .hour(dayjs(values.startTime).hour())
                  .minute(dayjs(values.startTime).minute())
                  .second(0)
                  .millisecond(0)
                  .toISOString(),

                endTime: dayjs(values.date)
                  .hour(dayjs(values.endTime).hour())
                  .minute(dayjs(values.endTime).minute())
                  .second(0)
                  .millisecond(0)
                  .toISOString(),
                name: values.name,
                company: values.company,
                email: values.email,
                tel: values.tel,
                roomId: values.roomId,
                numberOfAttendees: values.numberOfAttendees,
                details: values.details,
              }
            )
              .then((res) => {
                console.log(res);

                res.status === 200
                  ? handleChangeIsSubmit(true)
                  : alert("การจองไม่สำเร็จ");
              })
              .finally(() => handleChangeLoading(false));
          }}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <div className="flex gap-3 items-center mb-4">
                <img src={"./booking-logo.png"} className="ml-5 h-12" />
                <p className="text-lg font-semibold">ข้อมูลการจองห้องประชุม</p>
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* DATE */}
                <DatePicker
                  label="เลือกวันที่"
                  value={values.date}
                  disablePast
                  onChange={(val) => {
                    setFieldValue("date", val);

                    if (val && values.roomId) {
                      fetchBookedTimes(
                        Number(values.roomId),
                        dayjs(val).toDate()
                      );
                    }
                  }}
                  slotProps={{
                    textField: {
                      error: !!touched.date && !!errors.date,
                      helperText: touched.date && errors.date,
                      fullWidth: true,
                    },
                  }}
                />
                {/* ROOM */}
                <FormControl
                  fullWidth
                  error={!!touched.roomId && !!errors.roomId}
                  margin="normal"
                >
                  <InputLabel>เลือกห้อง</InputLabel>
                  <Select
                    name="roomId"
                    value={values.roomId}
                    label="เลือกห้อง"
                    onChange={(e) => {
                      handleChange(e);

                      if (values.date && e) {
                        fetchBookedTimes(
                          Number(e.target.value),
                          dayjs(values.date).toDate()
                        );
                      }
                    }}
                  >
                    {rooms.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* TIME */}
                <Box mt={2}>
                  <p>ช่วงเวลา</p>

                  <Box display="flex" gap={2} mt={1}>
                    {/* START TIME */}
                    <DesktopTimePicker
                      label="เริ่ม"
                      format="HH:mm"
                      ampm={false}
                      views={["hours", "minutes"]}
                      value={values.startTime}
                      onChange={(val) => {
                        setFieldValue("startTime", val);
                        setFieldValue("endTime", null);
                      }}
                      disablePast={
                        !!values.date &&
                        dayjs(values.date).isSame(dayjs(), "day")
                      }
                      disabled={!values.date || !values.roomId}
                      shouldDisableTime={(value) => {
                        const minute = value.hour() * 60 + value.minute();

                        return bookedTimes.some((booking) => {
                          const startMinute =
                            dayjs(booking.startTime).hour() * 60 +
                            dayjs(booking.startTime).minute();

                          const endMinute =
                            dayjs(booking.endTime).hour() * 60 +
                            dayjs(booking.endTime).minute();

                          // ❌ block ANY overlap (minute precision)
                          return minute >= startMinute && minute < endMinute;
                        });
                      }}
                      slotProps={{
                        textField: {
                          error: !!touched.startTime && !!errors.startTime,
                          helperText: touched.startTime && errors.startTime,
                        },
                      }}
                    />

                    {/* END TIME */}
                    <DesktopTimePicker
                      label="ถึง"
                      format="HH:mm"
                      ampm={false}
                      value={values.endTime}
                      onChange={(val) => setFieldValue("endTime", val)}
                      disabled={!values.startTime}
                      shouldDisableTime={(value, view) => {
                        if (!values.startTime) return true;

                        const start = dayjs(values.startTime);
                        const hour = value.hour();
                        const minute = value.minute();
                        const startHour = dayjs(values.startTime).hour();

                        // ❌ before start hour
                        if (hour < start.hour()) return true;

                        // ❌ same hour but minute <= start minute
                        if (hour === start.hour() && minute <= start.minute())
                          return true;

                        const nextBookedHour = bookedTimes
                          .map((b) => dayjs(b.startTime).hour())
                          .filter((h) => h > startHour)
                          .sort((a, b) => a - b)[0];

                        // must stop before next booking
                        if (
                          nextBookedHour !== undefined &&
                          hour >= nextBookedHour
                        )
                          return true;

                        // ❌ booked hours
                        return bookedTimes.some((booking) => {
                          const startH = dayjs(booking.startTime).hour();
                          const endH = dayjs(booking.endTime).hour();

                          return hour >= startH && hour < endH;
                        });
                      }}
                    />
                  </Box>
                </Box>

                <Box mt={4} mb={4}>
                  <p>ข้อมูลผู้จอง</p>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="ชื่อผู้จอง"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  {/* EMAIL */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="อีเมล"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="บริษัท/หน่วยงาน"
                    name="company"
                    value={values.company}
                    onChange={handleChange}
                    error={!!touched.company && !!errors.company}
                    helperText={touched.company && errors.company}
                  />
                  {/* TEL */}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="โทรศัพท์"
                    name="tel"
                    value={values.tel}
                    onChange={handleChange}
                    error={!!touched.tel && !!errors.tel}
                    helperText={touched.tel && errors.tel}
                  />
                  {/* NUMBER OF ATTENDEES */}
                  <div className="mt-4">
                    <NumberField
                      label="จำนวนผู้เข้าร่วม"
                      name="numberOfAttendees"
                      value={values.numberOfAttendees}
                      onValueChange={(value) =>
                        setFieldValue("numberOfAttendees", value)
                      }
                      error={
                        !!touched.numberOfAttendees &&
                        !!errors.numberOfAttendees
                      }
                      helper={
                        (touched.numberOfAttendees &&
                          errors.numberOfAttendees) ||
                        ""
                      }
                      min={1}
                      max={100}
                      // defaultValue={100}
                    />
                  </div>
                </Box>
                <Box mb={4}>
                  <p>รายละเอียดการใช้ห้องประชุม</p>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="รายละเอียดการใช้ห้องประชุม"
                    name="details"
                    multiline
                    rows={4}
                    value={values.details}
                    onChange={handleChange}
                    error={!!touched.details && !!errors.details}
                    helperText={touched.details && errors.details}
                  />
                </Box>
                {/* SUBMIT */}
                <button
                  type="submit"
                  className="sticky bottom-5 bg-linear-to-r from-primary-1 to-primary-3 
                          text-white px-4 py-3 rounded-full w-full z-10 shadow"
                >
                  Continue
                </button>
              </LocalizationProvider>
            </Form>
          )}
        </Formik>
      </section>
    </div>
  );
};

export default BookingPage;
