import * as yup from "yup";

export const bookingSchema = yup.object({
  date: yup.date().required("กรุณาเลือกวันที่"),
  startTime: yup.date().required("กรุณาเลือกเวลาเริ่ม"),
  endTime: yup
    .date()
    .required("กรุณาเลือกเวลาสิ้นสุด")
    .test("is-after", "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม", function (value: any) {
      const { startTime } = this.parent as any;
      if (!value || !startTime) return false;
      return value > startTime;
    }),
  name: yup.string().required("กรุณากรอกชื่อ"),
  company: yup.string().required("กรุณากรอกชื่อบริษัท"),
  email: yup.string().email().required("กรุณากรอกอีเมล"),
  tel: yup
    .string()
    .required("กรุณากรอกเบอร์โทร")
    .matches(/^(?:\+66|0)[689]\d{8}$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  roomId: yup.number().required("กรุณาเลือกห้อง"),
  numberOfAttendees: yup
    .number()
    .required("กรุณากรอกจำนวนผู้เข้าร่วม")
    .integer("จำนวนผู้เข้าร่วมต้องเป็นจำนวนเต็ม")
    .moreThan(0, "จำนวนผู้เข้าร่วมต้องมากกว่า 0")
    .lessThan(101, "จำนวนผู้เข้าร่วมต้องไม่เกิน 100"),
  details: yup.string().required("กรุณากรอกรายละเอียดการใช้ห้องประชุม"),
});
