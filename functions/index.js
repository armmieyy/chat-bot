const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4, v4 } = require('uuid');
const { deleteUser, getAuth } = require('firebase/auth');
const { async } = require('@firebase/util');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
let CHANNEL_ACCESS_TOKEN =
  'WQfqMphx5tHSuh7P4iy1ZX4d/hjf7EqmBSw6qXgXivbbA1bR/JvzN+QHx5z3hxD26fs8H9zIC1RPh2X6roNquPe7kfjXm2goguTB8ya3Iz0K5sJ/u6Tklgwl2/JDdtIAxUC/Qifc8A4G7umZt8WUagdB04t89/1O/w1cDnyilFU';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
};

const NGROKURL = 'https://97b0-2403-6200-8858-b01b-ecc8-497b-6ffd-c906.ap.ngrok.io';
const GIVERATE = NGROKURL + '/chatbot-49334/us-central1/giveRate?rate=';

const reply = (replyToken, payload) => {
  request.post({
    uri: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [payload],
    }),
  });
};
const pushMessage = (replyToken, payload) => {
  console.log(payload);
  request.post({
    uri: `${LINE_MESSAGING_API}/message/push`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      to: replyToken,
      messages: payload,
    }),
  });
};
exports.deleteUserById = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log(req.body.uid);
    admin.auth().deleteUser(req.body.uid);
    res.send('ok');
  });
});
exports.updateUserById = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log(req.body);
    admin
      .auth()
      .updateUser(req.body.id, { password: req.body.password })
      .then(resposn => {
        res.send('ok');
      })
      .catch(err => {
        res.send(err.code);
      });
  });
});

exports.createUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const db = admin.database();
    admin
      .auth()
      .createUser({
        email: req.body.email,
        emailVerified: false,
        password: req.body.password,
      })
      .then(resposn => {
        console.log(resposn.uid);
        db.ref(`/permission/${resposn.uid}`).set({
          district: parseInt(req.body.zone),
          email: resposn.email,
          role: 2,
        });
        res.send('ok');
      })
      .catch(err => {
        res.send(err.code);
      });
  });
});

exports.giveRate = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log(req.query);
    const db = admin.database();
    let order = [];
    db.ref(`/order/${req.query.id}`).once('value', snapshot => {
      const data = snapshot.val();
      if (!data.giveRate) {
        db.ref(`/order/${req.query.id}`).update({ giveRate: req.query.rate });
        db.ref('/rate/n').transaction(current_value => {
          return (current_value || 0) + 1;
        });
        db.ref('/rate/score').transaction(current_value => {
          return (current_value || 0) + parseInt(req.query.rate);
        });
        db.ref(`/rate/${req.query.rate}`).transaction(current_value => {
          return (current_value || 0) + 1;
        });
        console.log(req.body);
        return res.redirect('https://chatbot-49334.web.app/thankyou.html');
        // res.redirect('https://chatbot-49334.web.app/thankyou.html?');
      } else {
        res.redirect('https://chatbot-49334.web.app/thankyou.html?give=true');
      }
    });
  });
});

exports.replyChat = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // console.log(req.body.userId);
    const text = `เรียนคุณ  เนื่องจากปัญหาที่แจ้งเข้ามาเรื่อง  เราไม่สามารถดำเนินการแก้ไขให้ได้`;
    pushMessage(req.body.uid, [{ type: 'text', text: text }]);
  });
});

exports.messageReply = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.body.type === 'zone_control') {
      console.log(req.body);
      const db = admin.database();
      const ref = db.ref(`/order/${req.body.id}`);
      await ref.update({
        zone_control: `${req.body.zone_control}`,
        status: 'active_zone',
      });

      res.send('ok');
    }
    if (req.body.type === 'replyChat') {
      const text = `เรียนคุณ  เนื่องจากปัญหาที่แจ้งเข้ามาเรื่อง  เราไม่สามารถดำเนินการแก้ไขให้ได้`;
      pushMessage(req.body.uid, [
        {
          type: 'flex',
          altText: 'ดำเนินการเสร็จสิ้น',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'ตอบกลับจากเจ้าหน้าที่',
                  weight: 'bold',
                  size: 'xl',
                  wrap: true,
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `${req.body.date}`,
                    },
                  ],
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'ข้อความที่แจ้ง',
                      offsetTop: 'xl',
                    },
                  ],
                  paddingTop: 'xl',
                  paddingBottom: 'xxl',
                },
                {
                  type: 'separator',
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `${req.body.msg}`,
                      wrap: true,
                    },
                  ],
                  paddingBottom: 'xxl',
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'ข้อความตอบกลับ',
                    },
                    {
                      type: 'separator',
                    },
                    {
                      type: 'text',
                      text: `${req.body.reply}`,
                      wrap: true,
                    },
                  ],
                  paddingBottom: 'xxl',
                },
              ],
              paddingAll: 'md',
              margin: 'none',
            },
          },
        },
      ]);
      const db = admin.database();
      const ref = db.ref(`/chat/${req.body.key}`);
      await ref.update({ status: 'reply', reply: `${req.body.reply}` });
      res.send('ok');
    }

    if (req.body.type === 'complete') {
      console.log(req.body);
      const db = admin.database();
      const ref = db.ref(`/order/${req.body.id}`);
      await ref.update({ status: 'complete' });
      pushMessage(req.body.uid, [
        {
          type: 'flex',
          altText: 'ดำเนินการเสร็จสิ้น',
          contents: {
            type: 'bubble',
            hero: {
              type: 'image',
              url: `${req.body.image}`,
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${req.body.title}`,
                  weight: 'bold',
                  size: 'xl',
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: 'วันที่แจ้ง',
                          size: 'sm',
                          flex: 2,
                          wrap: true,
                        },
                        {
                          type: 'text',
                          text: `${req.body.date}`,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 5,
                        },
                      ],
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: 'สถานะ',
                          size: 'sm',
                          flex: 2,
                        },
                        {
                          type: 'text',
                          text: 'ดำเนินการเสร็จสิ้น',
                          wrap: true,
                          color: '#0ffe00',
                          size: 'sm',
                          flex: 5,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          type: 'flex',
          altText: 'ดำเนินการเสร็จสิ้น',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'ประเมินความพึงพอใจ',
                  weight: 'regular',
                  align: 'center',
                  wrap: true,
                  gravity: 'center',
                  size: 'lg',
                  margin: 'none',
                },
              ],
              spacing: 'none',
            },
            hero: {
              type: 'box',
              layout: 'horizontal',
              spacing: 'none',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'uri',
                        label: '1',
                        uri: `${GIVERATE + 1}&uid=${req.body.uid}&id=${
                          req.body.id
                        }`,
                      },
                      color: '#87B7FF',
                      style: 'primary',
                      margin: 'none',
                      position: 'relative',
                      gravity: 'top',
                      offsetStart: 'none',
                      offsetEnd: 'none',
                    },
                    {
                      type: 'button',
                      action: {
                        type: 'uri',
                        label: '2',
                        uri: `${GIVERATE + 2}&uid=${req.body.uid}&id=${
                          req.body.id
                        }`,
                      },
                      style: 'primary',
                      color: '#73ACFF',
                    },
                    {
                      type: 'button',
                      action: {
                        type: 'uri',
                        label: '3',
                        uri: `${GIVERATE + 3}&uid=${req.body.uid}&id=${
                          req.body.id
                        }`,
                      },
                      style: 'primary',
                      color: '#4A93FF',
                    },
                    {
                      type: 'button',
                      action: {
                        type: 'uri',
                        label: '4',
                        uri: `${GIVERATE + 4}&uid=${req.body.uid}&id=${
                          req.body.id
                        }`,
                      },
                      style: 'primary',
                      color: '#2F83FF',
                    },
                    {
                      type: 'button',
                      action: {
                        type: 'uri',
                        label: '5',
                        uri: `${GIVERATE + 5}&uid=${req.body.uid}&id=${
                          req.body.id
                        }`,
                      },
                      style: 'primary',
                      color: '#1271FF',
                    },
                  ],
                  margin: 'sm',
                  spacing: 'sm',
                },
              ],
              margin: 'none',
              offsetEnd: 'none',
              paddingAll: 'none',
              paddingStart: 'lg',
              paddingEnd: 'lg',
              paddingBottom: 'md',
            },
          },
        },
      ]);
      res.send('ok');
    }

    if (req.body.type === 'reply') {
      const db = admin.database();
      const ref = db.ref(`/order/${req.body.id}`);
      await ref.update({ status: 'receive', reply: `${req.body.textReply}` });
      pushMessage(req.body.uid, [
        {
          type: 'flex',
          altText: 'ทางเราได้รับเรื่องแล้ว',
          contents: {
            type: 'bubble',
            hero: {
              type: 'image',
              url: `${req.body.image}`,
              size: 'full',
              aspectRatio: '20:13',
              aspectMode: 'cover',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${req.body.title}`,
                  weight: 'bold',
                  size: 'xl',
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: 'วันที่แจ้ง',
                          size: 'sm',
                          flex: 2,
                          wrap: true,
                        },
                        {
                          type: 'text',
                          text: `${req.body.date}`,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 5,
                        },
                      ],
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: 'สถานะ',
                          size: 'sm',
                          flex: 2,
                        },
                        {
                          type: 'text',
                          text: 'รับเรื่อง',
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 5,
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'none',
                  contents: [
                    {
                      type: 'text',
                      text: 'ข้อความตอบกลับจากเจ้าหน้าที่',
                      size: 'sm',
                      wrap: true,
                      margin: 'none',
                      offsetTop: 'none',
                    },
                  ],
                  paddingTop: 'lg',
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `${req.body.textReply}`,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [],
                  margin: 'sm',
                },
              ],
              flex: 0,
            },
          },
        },
      ]);
      res.send('ok');
    }

    if (req.body.type === 'notInvoled') {
      console.log(req.body);
      const db = admin.database();
      const ref = db.ref(`/order/${req.body.id}`);
      await ref.update({ status: 'notInvoled' });
      const text = `เรียนคุณ ${req.body.displayName} เนื่องจากปัญหาที่แจ้งเข้ามาเรื่อง ${req.body.title}  เราไม่สามารถดำเนินการแก้ไขให้ได้`;
      pushMessage(req.body.uid, [{ type: 'text', text: text }]);
      res.send('ok');
    }
  });
});

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  let fetchData = [];
  const kind = [
    'ประปา',
    'อื่นๆ',
    'ถนน',
    'ต้นไม้',
    'ความสะอาด',
    'ไฟฟ้า',
    'ทางเท้า',
    'จราจร จอดรถ',
    'กลิ่น',
    'เสียง',
  ];
  const userId = req.body.events[0].source.userId;
  const message = req.body.events[0].message;
  const event = req.body.events[0];
  const db = admin.database();
  const ref = db.ref('/order');
  await ref.on('value', async snapshot => {
    const res = snapshot.val();
    for (const key in res) {
      fetchData.push({ ...res[key], id: key });
    }
  });
  fetchData = await fetchData.filter(
    item => item.status == 'inProgress' && item.uid === userId,
  );

  if (event.type === 'unfollow') {
    db.ref('/stat/friends').transaction(current_value => {
      return (current_value || 0) - 1;
    });
    res.send('200');
  }
  if (event.type === 'follow') {
    db.ref('/stat/friends').transaction(current_value => {
      return (current_value || 0) + 1;
    });
    res.send('200');
  }

  if (fetchData.length > 0) {
    // console.log(kind.indexOf(message.text));

    if (message.text == 'แจ้งปัญหา') {
      await reply(event.replyToken, {
        type: 'text',
        text: 'โปรดเลือกประเภทปัญหาที่แจ้ง',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'ประปา',
                text: 'ประปา',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'ไฟฟ้า',
                text: 'ไฟฟ้า',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'ถนน',
                text: 'ถนน',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'ต้นไม้',
                text: 'ต้นไม้',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'ความสะอาด',
                text: 'ความสะอาด',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'ทางเท้า',
                text: 'ทางเท้า',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'จราจร จอดรถ',
                text: 'จราจร จอดรถ',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'กลิ่น',
                text: 'กลิ่น',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'เสียง',
                text: 'เสียง',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'อื่นๆ',
                text: 'อื่นๆ',
              },
            },
          ],
        },
      });
    }

    if (kind.indexOf(message.text) > -1) {
      await db.ref(`/order/${fetchData[0].id}`).update({ kind: message.text });
      await reply(event.replyToken, {
        type: 'text',
        text: 'โปรดแจ้งรายละเอียดของปัญหา',
      });

      return res.send('200');
    }

    if (message.type == 'text') {
      console.log(message.text);
      await db
        .ref(`/order/${fetchData[0].id}`)
        .update({ message: message.text });
      await reply(event.replyToken, {
        type: 'text',
        text: 'โปรดส่งรูปภาพของปัญหาที่ต้องการแจ้ง',
        quickReply: {
          items: [
            {
              type: 'action',
              imageUrl:
                'https://cdn.dribbble.com/users/3511384/screenshots/6601006/main-zoom---longer---dribbble2.gif',
              action: {
                type: 'camera',
                label: 'กล้องถ่ายรูป',
              },
            },
            {
              type: 'action',
              imageUrl:
                'https://www.pngfind.com/pngs/m/349-3497914_png-file-svg-album-icon-transparent-png.png',
              action: {
                type: 'cameraRoll',
                label: 'อัลบั้ม',
              },
            },
          ],
        },
      });
      return res.send('200');
    }

    if (message.type === 'image') {
      let buffer;
      await request
        .get(`https://api-data.line.me/v2/bot/message/${message.id}/content`, {
          headers: LINE_HEADER,
          encoding: null,
        })
        .then(async res => {
          buffer = res;
          const filename = event.timestamp;
          const originalLocalFile = path.join(os.tmpdir(), filename + '.jpg');
          fs.writeFileSync(originalLocalFile, buffer);
          ////upload
          const uuid = v4();
          const imgUrl = await uploadImage(
            event.source.userId,
            originalLocalFile,
            filename,
            uuid,
          );
          const refByKey = db
            .ref(`/order/${fetchData[0].id}`)
            .update({ image: imgUrl });
          fs.unlinkSync(originalLocalFile);
          await reply(event.replyToken, {
            type: 'text',
            text: 'โปรดส่งพิกัดสถานที่',
            quickReply: {
              items: [
                {
                  type: 'action',
                  imageUrl:
                    'https://i.pinimg.com/originals/45/2c/3d/452c3deef1a83f6dee5ea526f3bcb5cf.gif',
                  action: {
                    type: 'location',
                    label: 'ส่งตำแหน่งที่อยู่',
                  },
                },
              ],
            },
          });
        });

      return res.send('200');
    }

    if (message.type === 'location') {
      await db.ref(`/order/${fetchData[0].id}/location`).update({
        address: message.address,
        la: message.latitude,
        lo: message.longitude,
      });
      await db.ref(`/order/${fetchData[0].id}`).update({
        status: 'wait',
      });
      await reply(event.replyToken, {
        type: 'text',
        text: 'กำลังดำเนินการส่งเรื่องโปรดรอตอบกลับ',
      });

      return res.send('200');
    }
  } else {
    let displayName = '';
    await request
      .get(`https://api.line.me/v2/bot/profile/${userId}`, {
        headers: LINE_HEADER,
      })
      .then(res => {
        const data = JSON.parse(res);
        displayName = data.displayName;
      });
    switch (message.type) {
      case 'text':
        if (message.text == 'แจ้งปัญหา') {
          console.log(message.text);
          await ref.push({
            image: '',
            location: {
              la: '',
              lo: '',
              address: '',
            },
            message: '',
            status: 'inProgress',
            date: new Date().toLocaleString('en-GB', {
              timeZone: 'Asia/Jakarta',
            }),
            uid: userId,
            displayName: displayName,
            kind: '',
          });
          await reply(event.replyToken, {
            type: 'text',
            text: 'โปรดเลือกประเภทปัญหาที่แจ้ง',
            quickReply: {
              items: [
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'ประปา',
                    text: 'ประปา',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'ไฟฟ้า',
                    text: 'ไฟฟ้า',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'ถนน',
                    text: 'ถนน',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'ต้นไม้',
                    text: 'ต้นไม้',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'ความสะอาด',
                    text: 'ความสะอาด',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'ทางเท้า',
                    text: 'ทางเท้า',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'จราจร จอดรถ',
                    text: 'จราจร จอดรถ',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'กลิ่น',
                    text: 'กลิ่น',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'เสียง',
                    text: 'เสียง',
                  },
                },
                {
                  type: 'action',
                  action: {
                    type: 'message',
                    label: 'อื่นๆ',
                    text: 'อื่นๆ',
                  },
                },
              ],
            },
          });
        }
        break;
      default:
        await reply(event.replyToken, {
          type: 'text',
          text: 'โปรดแจ้งปัญหา รายละเอียดปัญหา',
        });
    }
  }
  res.send('Hello from Firebase!');
});

const uploadImage = async (userId, imgLocalFile, filename, uuid) => {
  const bucket = admin.storage().bucket();
  const file = await bucket.upload(imgLocalFile, {
    // กำหนด path ในการเก็บไฟล์แยกเป็นแต่ละ userId
    destination: `photos/${userId}/${filename}.jpg`,
    metadata: {
      cacheControl: 'no-cache',
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });
  const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o`;
  const suffix = `alt=media&token=${uuid}`;

  // ส่งคืนค่า public url ของรูปออกไป
  return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`;
};
