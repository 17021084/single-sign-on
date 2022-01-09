# SSO-Demo

## Vấn đề
Một công ty ```company``` có rất nhiều dịch vụ vd ```service1```,```service2```,```service3``` 
việc nhớ hết tài khoản mật khẩu của  các dịch vụ này thì rất là mệt. <br/>

___Mong muốn___ : Có một trang đăng nhập chung cho tất cả các services của công ty ```company``` <br/>

=> Từ đó SSO ra đời dựa trên cơ chế cùng origin thì share cookies <br/>

## Props and Cons
Props:
* Giảm số lượng username và password người dùng phải nhớ.
* Giảm số lượng login vào các dịch vụ.
* Phân quyền 

<br/>
Cons: 
* Tốn chi phi để chạy SSO server .

## Mechanism
#### Share cookies 




## Cách chạy demo.
* ```git clone .....``` project về
* ```cd ....``` vào các folder để tải cái packages.
* Sửa lại file host ở máy cá nhân
Dòng ```MacOS``` or ```Ubuntu``` nằm ở ``` /etc/hosts ```. <br/>

```bash
# demo sso

127.0.0.1  company.trung
127.0.0.1  service.diffent-company.trung
127.0.0.1  service1.company.trung
127.0.0.1  service2.company.trung
127.0.0.1  service3.company.trung

```
* start các services ở mỗi folder.

***Chú ý***
- Demo nên việc authen diễn ra đơn giản ko cần phải lưu ở db. <br>
```js 
//  list tài khoản được đặt ở file 
// ./server/ListAccount.js
const ListAccount = [
  {
    id: 1,
    name: "trung",
    username: "trungdq1",
    password: "trungdq1",
    age:12,
  },
  // .....
]
```
- set cookies phải có thuộc tính domain ví dụ: 
```bash
document.cookie="user_id=1295214458; Path=/; Domain=.company.trung;"
```




[Reference]("https://codeburst.io/building-a-simple-single-sign-on-sso-server-and-solution-from-scratch-in-node-js-ea6ee5fdf340")
