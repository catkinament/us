// src/components/Home.js
import React, { useEffect, useState } from 'react';

const calculateTimeUntil = (month, day) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  let targetDate = new Date(currentYear, month - 1, day, 0, 0, 0); // 设置生日时间为 00:00:00

  if (targetDate < now) {
    targetDate.setFullYear(currentYear + 1); // 如果今年已过生日，就用明年的
  }

  const diffMs = targetDate - now;
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

const Home = () => {
  const myBirthday = { month: 10, day: 5 };      // 你的生日
  const partnerBirthday = { month: 4, day: 7 }; // 爱人的生日

  const [timeUntilMyBirthday, setTimeUntilMyBirthday] = useState(calculateTimeUntil(myBirthday.month, myBirthday.day));
  const [timeUntilPartnerBirthday, setTimeUntilPartnerBirthday] = useState(calculateTimeUntil(partnerBirthday.month, partnerBirthday.day));

  const [showMyBirthdayAlert, setShowMyBirthdayAlert] = useState(false);
  const [showPartnerBirthdayAlert, setShowPartnerBirthdayAlert] = useState(false);

  // 每秒更新倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilMyBirthday(calculateTimeUntil(myBirthday.month, myBirthday.day));
      setTimeUntilPartnerBirthday(calculateTimeUntil(partnerBirthday.month, partnerBirthday.day));
    }, 1000);

    return () => clearInterval(interval); // 清理 interval
  }, []);

  // 检查生日是否在七天以内
  useEffect(() => {
    if (timeUntilMyBirthday.days <= 7 && timeUntilMyBirthday.days >= 0) {
      setShowMyBirthdayAlert(true);
    } else {
      setShowMyBirthdayAlert(false);
    }

    if (timeUntilPartnerBirthday.days <= 7 && timeUntilPartnerBirthday.days >= 0) {
      setShowPartnerBirthdayAlert(true);
    } else {
      setShowPartnerBirthdayAlert(false);
    }
  }, [timeUntilMyBirthday, timeUntilPartnerBirthday]);

  return (
    <div className="p-8 text-center font-sans bg-pink-50 min-h-screen">
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎂 破壳日倒计时</h2>

        <div className="text-left text-gray-700 space-y-4">
          <p>🧁 西西的生日：{myBirthday.month}月{myBirthday.day}日</p>
          <p>
            还有 <span className="font-bold text-pink-500">{timeUntilMyBirthday.days}</span> 天{' '}
            <span className="font-bold text-pink-500">{timeUntilMyBirthday.hours}</span> 小时{' '}
            <span className="font-bold text-pink-500">{timeUntilMyBirthday.minutes}</span> 分钟{' '}
            <span className="font-bold text-pink-500">{timeUntilMyBirthday.seconds}</span> 秒
          </p>

          <p>🍰 卜卜的生日：{partnerBirthday.month}月{partnerBirthday.day}日</p>
          <p>
            还有 <span className="font-bold text-pink-500">{timeUntilPartnerBirthday.days}</span> 天{' '}
            <span className="font-bold text-pink-500">{timeUntilPartnerBirthday.hours}</span> 小时{' '}
            <span className="font-bold text-pink-500">{timeUntilPartnerBirthday.minutes}</span> 分钟{' '}
            <span className="font-bold text-pink-500">{timeUntilPartnerBirthday.seconds}</span> 秒
          </p>
        </div>
      </div>

      {/* 西西生日前7天弹出提示 */}
      {showMyBirthdayAlert && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg shadow-lg">
          🎉 西西的生日快到了！只有 {timeUntilMyBirthday.days} 天哦！
        </div>
      )}

      {/* 卜卜生日前7天弹出提示 */}
      {showPartnerBirthdayAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg shadow-lg">
          🎉 卜卜的生日快到了！只有 {timeUntilPartnerBirthday.days} 天哦！
        </div>
      )}
    </div>
  );
};

export default Home;
