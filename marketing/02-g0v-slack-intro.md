# g0v Slack Intro Post

Post in `#general` channel of g0v Slack (g0v.tw/zh-TW/get-involved/, request invite via the website).

**Best time**: weekday afternoon Taiwan time. Avoid Friday evenings.

**Tone notes**: g0v community values humility, technical substance, and explicit "I'm new here, here's what I built, what's missing, who wants to talk" framing. Avoid marketing speak.

---

## Version A — Recommended

```
大家好 👋

我是 Lawrence，剛從上海搬來台北（金卡科技領域），在做一個開源專案叫 Forge——

把每個台灣工程師都重複實作過的東西（身分證/統編/健保卡/民國紀年/車牌/電話/地址⋯⋯）做成一套零依賴的開源 React 元件庫。MIT 授權，目前 21 個元件，11 個純函式驗證器，157 筆測試。

主要因為過去用過台灣產品時遇到太多「合法的身分證被系統拒絕」、「電話格式無法輸入」這類問題。也想讓 g0v 圈與政府開源圈以後不必每次重造輪子。

🔗 https://taiwan-ui.vercel.app
🔗 https://github.com/LawrenceKuok/taiwan-ui

幾個我特別在意的設計決策（如果想討論）：

1. 公開維護 GOVT_READINESS.md，逐項列出本套件「不適合」用於哪些情境，避免被誤用於高風險場景
2. 驗證器全部是 pure function，在 lib/validators/，不依賴 React，可獨立測試
3. 涵蓋冷門但關鍵的規格：馬祖 0836、烏坵 0826、新式居留證 (2021+) 第二字母限制、統編 7-rule

接下來想做的事：
- 發布到 npm（含 SLSA provenance）
- 做完整的繁中文件站
- 串接戶政司、商業司、健保署的真偽驗證 API（v0.3）
- 把這套東西真的推進政府開源生態

幾個請教大家的問題：
- 有誰在做類似的事？想避免重工
- 政府 API 串接（特別是戶政司）有過經驗的朋友請聲援
- g0v 補助申請有什麼要避免的地雷？

期待認識大家，歡迎私訊或開 issue 一起聊 🙏
```

---

## Version B — Shorter / casual

```
👋 g0v 大家好，剛搬來台北、在做開源 Forge

把身分證/統編/健保卡/民國紀年那些每個人都重複寫的驗證器做成 React 元件庫，MIT 授權、零依賴、有測試。

🔗 taiwan-ui.vercel.app

想找人一起做：
- 政府 API 真偽驗證串接
- 繁中文件
- v0.3 之後的方向討論

歡迎開 issue / DM。🙏
```

Use Version B if `#general` already has a lot of activity and you don't want to dominate the channel. Use Version A on a quieter day.

---

## Follow-up actions

Within 24 hours of posting:

1. **Watch reactions** — note who 👍 / who comments. They're potential collaborators.
2. **DM the most engaged commenters** — propose a quick chat (15min).
3. **Open a request** for a `#taiwan-ui` channel via Slack admin (clkao 高嘉良 / sponsor / Slack admin team) once you have 3+ interested people.
4. **Cross-post** to g0v hackpad if there's an active "introduce yourself" page.

## What NOT to do

- ❌ Don't @everyone or @channel — instant strike against you
- ❌ Don't post in 3+ channels the same day — read as spam
- ❌ Don't immediately ask for grant endorsement — let the project speak first
- ❌ Don't argue with the first skeptical comment — engage thoughtfully or ignore

## Next g0v event you should attend in person

g0v 雙月大松 (every other month):

- Date: usually first Saturday of even months (Feb, Apr, Jun, Aug, Oct, Dec)
- Location: 中央研究院 人文社會科學館 (Academia Sinica, Nangang)
- Free, no registration needed
- 90% of meaningful g0v relationships are forged here, not in Slack

If you're in Taiwan during one of these, **go**. Bring 5 stickers and a 30-second pitch.
