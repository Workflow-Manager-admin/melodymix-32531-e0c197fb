import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import adeleAvatar from './adele-avatar.png';
import lanaDelReyAvatar from './lana-del-rey-avatar.jpg';
import taylorSwiftAvatar from './taylor-swift-avatar.jpg';
import coldplayAvatar from './coldplay-avatar.jpg';
import theWeekndAvatar from './the-weeknd-avatar.jpg';
// Only this single Alan Walker avatar import should remain
import alanWalkerAvatar from './alan-walker-avatar-latest.jpg';

/*
 * A simple in-app component for user registration & login
 */
function SignUpLogin({ onAuthSuccess, palette }) {
  const [mode, setMode] = useState("signup"); // or 'login'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Use localStorage for persistence between reloads
  const [storedUsers, setStoredUsers] = useState(() => {
    try {
      const users = window.localStorage.getItem("mmix_users");
      return users ? JSON.parse(users) : {};
    } catch {
      return {};
    }
  });
  const [error, setError] = useState("");
  const audioRef = useRef(null); // For sound playback

  // Register user in local state
  function handleSignUp(e) {
    e.preventDefault();
    // Clear error immediately to avoid lingering UI messages
    setError("");
    if (!username || !password) {
      setError("Username and password required.");
      return;
    }
    if (storedUsers[username]) {
      setError("User already exists. Please log in.");
      return;
    }
    // Register new user and flush state first so form disables quickly/etc.
    setStoredUsers((prev) => {
      const newUsers = { ...prev, [username]: password };
      window.localStorage.setItem("mmix_users", JSON.stringify(newUsers));
      return newUsers;
    });
    // Play success sound then immediately transition (don’t block on audio)
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        // Use play().catch for browsers with autoplay restrictions, ignoring errors
        audioRef.current.play().catch(() => {});
      } catch {}
    }
    // Transition view instantly—don’t wait for sound to finish, let audio play in background
    setTimeout(() => {
      setError(""); // Defensive: clear any race error
      onAuthSuccess(username);
    }, 250); // 250ms for better UX feel. Remove needless waiting.
  }

  // Log in
  function handleLogin(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password required.");
      return;
    }
    // Load users fresh from localStorage in case there was a new signup in another tab
    let users;
    try {
      users = JSON.parse(window.localStorage.getItem("mmix_users")) || {};
    } catch {
      users = {};
    }
    if (!users[username] || users[username] !== password) {
      setError("Invalid login. Try again or switch to sign up.");
      return;
    }
    setError("");
    onAuthSuccess(username);
  }

  // Always stay in sync with latest stored users (e.g. across tabs)
  useEffect(() => {
    const onStorage = () => {
      try {
        const users = window.localStorage.getItem("mmix_users");
        setStoredUsers(users ? JSON.parse(users) : {});
      } catch {
        setStoredUsers({});
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  // Reset error and fields when switching modes
  useEffect(() => {
    setUsername("");
    setPassword("");
    setError("");
  }, [mode]);

  return (
    <div style={{
      maxWidth: 400,
      margin: "120px auto",
      background: palette.secondary,
      borderRadius: "16px",
      boxShadow: "0 2px 16px rgba(255,128,227,0.08)",
      padding: "42px 32px 30px 32px",
      border: `2.5px solid ${palette.primary}`,
      color: palette.accent,
      fontFamily: "inherit"
    }}>
      <audio ref={audioRef} src={process.env.PUBLIC_URL ? process.env.PUBLIC_URL+'/success-chime.mp3' : "success-chime.mp3"} preload="auto" />
      <h2 style={{margin: 0, marginBottom: 25, textAlign: "center", color: palette.primary}}>
        {mode === "signup" ? "Sign Up for MelodyMix" : "Log In to MelodyMix"}
      </h2>

      <form onSubmit={mode === "signup" ? handleSignUp : handleLogin} autoComplete="off">
        <div style={{marginBottom: 18}}>
          <label style={{fontWeight: 600, letterSpacing: "-0.5px", fontSize: 17}} htmlFor="username">Username</label>
          <input
            autoFocus
            id="username"
            type="text"
            value={username}
            autoComplete="username"
            onChange={e => setUsername(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "11px 13px",
              marginTop: 7,
              marginBottom: 8,
              borderRadius: 7,
              border: `1.5px solid ${palette.primary}`,
              fontSize: 17,
              color: palette.accent,
              outline: "none"
            }}
          />
        </div>
        <div style={{marginBottom: 16}}>
          <label style={{fontWeight: 600, letterSpacing: "-0.5px", fontSize: 17}} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={mode==="signup" ? "new-password" : "current-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "11px 13px",
              marginTop: 7,
              borderRadius: 7,
              border: `1.5px solid ${palette.primary}`,
              fontSize: 17,
              color: palette.accent,
              outline: "none"
            }}
          />
        </div>
        {error &&
          <div style={{ color: "#b50043", marginBottom: 12, fontWeight: 700, fontSize: 15 }}>
            {error}
          </div>
        }
        <button className="btn btn-large" style={{width: "100%", background: palette.primary, color: palette.accent, fontWeight: 700, fontSize: 18, margin:"18px 0 0 0"}} type="submit">
          {mode === "signup" ? "Sign Up" : "Log In"}
        </button>
      </form>

      <div style={{marginTop: 27, textAlign: "center", fontSize: 16, color: palette.accent}}>
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button className="btn" style={{
              background: "none",
              color: palette.primary,
              fontWeight: 700,
              boxShadow: "none",
              textDecoration: "underline",
              fontSize: 16,
              padding: 0,
              border: "none",
              cursor: "pointer"
            }} onClick={() => { setMode("login"); setError(""); }}>
              Log In
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button className="btn" style={{
              background: "none",
              color: palette.primary,
              fontWeight: 700,
              boxShadow: "none",
              textDecoration: "underline",
              fontSize: 16,
              padding: 0,
              border: "none",
              cursor: "pointer"
            }} onClick={() => { setMode("signup"); setError(""); }}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Core MelodyMix app container with sign up/login gating, then music app flow.
 */
// PUBLIC_INTERFACE
function App() {
  // Authentication state
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // App state steps: "language", "artist", "song", "lyrics"
  const [language, setLanguage] = useState(null); // "Tamil" | "English"
  const [artist, setArtist] = useState(null);
  const [song, setSong] = useState(null);
  const [step, setStep] = useState("language");
  const [songs, setSongs] = useState([]);
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsError, setLyricsError] = useState(null);
  const [ytVideoId, setYtVideoId] = useState(null);
  const [ytLoading, setYtLoading] = useState(false);

  // Hardcoded artists and their songs, with images (use royalty-free or Wikipedia images)
  // Royalty-free placeholder (CC0) for missing artist images
  const placeholderImg =
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_placeholder.png";

  const artistData = {
    Tamil: [
      {
        name: "Ilayaraja",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/9a/Ilaiyaraaja_at_Hungama_Records_Audio_Release.JPG",
        songs: [
          "Thenpaandi Cheemayile",
          "Annakili Unnai Theduthe",
          "En Iniya Pon Nilave",
          "Rakkamma Kaiya Thattu",
          "Naanaga Naanillai"
        ],
      },
      {
        name: "AR Rahman",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/94/A._R._Rahman_2019.jpg",
        songs: [
          "Chaiyya Chaiyya",
          "Anbil Avan",
          "Vennilave Vennilave",
          "Ennavale Adi Ennavale",
          "Ottagathai Kattiko"
        ],
      },
      {
        name: "Vidyasagar",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/c/cf/Vidyasagar.jpg",
        songs: [
          "Apdi Podu",
          "Malare Mounama",
          "Kannalane",
          "Dole Dole",
          "O Podu"
        ],
      },
      {
        name: "Harris Jayaraj",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/4/4a/Harris_Jayaraj_at_the_Anegan_Audio_Launch.jpg",
        songs: [
          "Vaseegara",
          "Uyirin Uyire",
          "Hasili Fisiliye",
          "Ondra Renda",
          "Nenjai Poo Pol Koithavaley"
        ],
      },
      {
        name: "Yuvan Shankar Raja",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/7/74/Yuvan_Shankar_Raja.jpg",
        songs: [
          "Idhu Kaadhal Kadhal Kaatchi",
          "Loosu Penne",
          "En Kadhal Solla",
          "Venmegam",
          "Oru Naalil",
          "Rowdy Baby"
        ],
      },
      {
        name: "GV Prakash",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/7/7b/G._V._Prakash_Kumar_at_Lal_Bahadur_Shastri_Academy_Of_Music.jpg",
        songs: [
          "Un Mela Aasadhaan",
          "Yathe Yathe",
          "Pookkal Pookkum",
          "Imaye Imaye",
          "Ayyayo Nenju"
        ],
      },
      {
        name: "Anirudh Ravichander",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/9f/Anirudh_Ravichander.png",
        songs: [
          "Why This Kolaveri Di",
          "Vaathi Coming",
          "Don'u Don'u Don'u",
          "Selfie Pulla",
          "Surviva"
        ],
      },
      {
        name: "Santhosh Narayanan",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/7/78/Santhosh_Narayanan_during_the_Audio_Launch_of_Jigarthanda.jpg",
        songs: [
          "Kaavaalaa",
          "Naan Nee",
          "Enjoy Enjaami",
          "Thangamey",
          "Kannama"
        ],
      },
      // Example: if you need to add a generic/unknown artist in the future,
      // provide no image and the placeholderImg will show up
      // { name: "Unknown Tamil Artist", songs: ["Sample Song 1"] }
    ],
    English: [
      // Merged, full English artist list (Taylor Swift + previous and current)
      {
        name: "Ed Sheeran",
        image: require('./ed-sheeran-avatar.png'),
        songs: [
          "Shape of You",
          "Perfect",
          "Thinking Out Loud",
          "Photograph"
        ]
      },
      {
        name: "Adele",
        image: adeleAvatar,
        songs: [
          "Hello",
          "Rolling in the Deep",
          "Someone Like You",
          "Set Fire to the Rain"
        ]
      },
      {
        name: "Taylor Swift",
        image: taylorSwiftAvatar,
        songs: [
          "Love Story",
          "Blank Space",
          "Shake It Off",
          "You Belong With Me",
          "Cardigan"
        ]
      },
      {
        name: "Lana Del Rey",
        image: lanaDelReyAvatar,
        songs: [
          "Summertime Sadness",
          "Young and Beautiful",
          "Born to Die",
          "Video Games",
          "Diet Mountain Dew"
        ]
      },
      {
        name: "Coldplay",
        image: coldplayAvatar,
        songs: [
          "Viva La Vida",
          "Fix You",
          "Yellow",
          "Paradise"
        ]
      },
      {
        name: "The Weeknd",
        image: theWeekndAvatar,
        songs: [
          "Blinding Lights",
          "Starboy",
          "The Hills",
          "Save Your Tears"
        ]
      },
      {
        name: "Alan Walker",
        image: alanWalkerAvatar,
        songs: [
          "Faded",
          "Alone",
          "Spectre",
          "Darkside"
        ]
      },
      // Example: if you need to add a generic/unknown artist in the future,
      // provide no image and the placeholderImg will show up
      // { name: "Unknown English Artist", songs: ["Sample Song 1"] }
    ],
  };

  // Palette from task
  const palette = {
    primary: "#ff80e3",
    secondary: "#fde7eb",
    accent: "#4c535d",
    mode: "light",
  };

  // Reset step navigation
  function handleLanguage(lang) {
    setLanguage(lang);
    setArtist(null);
    setSong(null);
    setStep("artist");
    setLyrics(null);
    setLyricsError(null);
    setYtVideoId(null);
  }
  function handleArtistSelect(artistObj) {
    setArtist(artistObj);
    setSongs(artistObj.songs);
    setSong(null);
    setStep("song");
    setLyrics(null);
    setLyricsError(null);
    setYtVideoId(null);
  }
  function handleSongSelect(songName) {
    setSong(songName);
    setLyrics(null);
    setLyricsError(null);
    setYtVideoId(null);
    setStep("lyrics");
  }
  function handleBack(to) {
    if (to === "language") {
      setStep("language");
      setLanguage(null);
      setArtist(null);
      setSong(null);
      setLyrics(null);
      setLyricsError(null);
      setYtVideoId(null);
    } else if (to === "artist") {
      setStep("artist");
      setArtist(null);
      setSong(null);
      setLyrics(null);
      setLyricsError(null);
      setYtVideoId(null);
    } else if (to === "song") {
      setStep("song");
      setSong(null);
      setLyrics(null);
      setLyricsError(null);
      setYtVideoId(null);
    }
  }

  // Fetch lyrics when song selected, except for Tamil (do not fetch for Tamil, display informational message)
  useEffect(() => {
    if (!artist || !song) return;
    if (step !== "lyrics") return;

    if (language === "Tamil") {
      setLyrics(null);
      setLyricsError("Lyrics are not available for Tamil songs.");
      setLyricsLoading(false);
      return;
    }

    setLyricsLoading(true);
    setLyricsError(null);

    // Clean artist name and song title for possible trailing spaces or symbols
    const safeArtist = artist && artist.name ? artist.name.trim() : "";
    const safeSong = song ? song.trim() : "";

    // Only fetch if both artist and song names are non-empty after trimming
    if (!safeArtist || !safeSong) {
      setLyrics(null);
      setLyricsError("Lyrics unavailable (invalid artist/song title).");
      setLyricsLoading(false);
      return;
    }

    fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(safeArtist)}/${encodeURIComponent(safeSong)}`
    )
      .then((r) => {
        if (!r.ok) {
          // lyrics.ovh returns 404 for not found lyrics instead of a JSON error
          throw new Error("Lyrics not found");
        }
        return r.json();
      })
      .then((d) => {
        if (d.lyrics && typeof d.lyrics === "string" && d.lyrics.trim() !== "") {
          setLyrics(d.lyrics);
          setLyricsError(null);
        } else {
          setLyrics(null);
          setLyricsError("Lyrics not found for this song.");
        }
      })
      .catch((err) => {
        setLyrics(null);
        // Provide user-friendly error
        if (err.message === "Lyrics not found") {
          setLyricsError("Lyrics not found for this song. Try another track.");
        } else {
          setLyricsError("Lyrics unavailable (network or API error).");
        }
      })
      .finally(() => setLyricsLoading(false));
  }, [artist, song, step, language]);

  // Fetch YouTube video when lyrics page loads
  useEffect(() => {
    if (!artist || !song) return;
    if (step !== "lyrics") return;
    setYtLoading(true);
    setYtVideoId(null);
    // YouTube Search API v3
    const apiKey = "AIzaSyDiFCOiIRftlin1m8BTbp4jMvNnNy7tPyc";
    const query = `${artist.name} ${song} official music`;
    const maxResults = 1;
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&key=${apiKey}&type=video&maxResults=${maxResults}&videoEmbeddable=true`
    )
      .then((r) => r.json())
      .then((d) => {
        if (
          d.items &&
          d.items.length > 0 &&
          d.items[0].id &&
          d.items[0].id.videoId
        )
          setYtVideoId(d.items[0].id.videoId);
      })
      .catch(() => setYtVideoId(null))
      .finally(() => setYtLoading(false));
  }, [artist, song, step]);

  // Main view rendering per step
  // If not authenticated, only show sign up / login UI and hide rest of app.
  if (!authenticatedUser) {
    return (
      <div className="app" style={{
        background: palette.secondary,
        color: palette.accent,
        minHeight: "100vh"
      }}>
        <nav
          className="navbar"
          style={{
            background: palette.primary,
            color: palette.accent,
            borderColor: palette.accent,
          }}
        >
          <div className="container" style={{ maxWidth: "1100px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div className="logo" style={{ gap: 8, color: palette.accent }}>
                <span
                  className="logo-symbol"
                  style={{
                    color: palette.accent,
                    background: palette.secondary,
                    borderRadius: "50%",
                    padding: "2px 8px",
                    marginRight: 7,
                    fontWeight: "bold",
                  }}
                >
                  ♫
                </span>
                MelodyMix
              </div>
            </div>
          </div>
        </nav>
        {/* Show authentication form centered */}
        <main>
          <SignUpLogin palette={palette} onAuthSuccess={setAuthenticatedUser} />
        </main>
        <footer
          style={{
            textAlign: "center",
            width: "100%",
            fontSize: 16,
            color: palette.accent,
            paddingBottom: 36,
          }}
        >
          <span style={{ color: palette.primary, fontWeight: 700 }}>
            MelodyMix
          </span>{" "}
          &copy; {new Date().getFullYear()} | For music fans
        </footer>
      </div>
    );
  }

  // Otherwise, show language selection and the rest of the flow
  return (
    <div
      className="app"
      style={{
        background: palette.secondary,
        color: palette.accent,
        minHeight: "100vh",
      }}
    >
      <nav
        className="navbar"
        style={{
          background: palette.primary,
          color: palette.accent,
          borderColor: palette.accent,
        }}
      >
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div className="logo" style={{ gap: 8, color: palette.accent }}>
              <span
                className="logo-symbol"
                style={{
                  color: palette.accent,
                  background: palette.secondary,
                  borderRadius: "50%",
                  padding: "2px 8px",
                  marginRight: 7,
                  fontWeight: "bold",
                }}
              >
                ♫
              </span>
              MelodyMix
            </div>
            {step !== "language" && (
              <button
                className="btn"
                style={{
                  background: palette.accent,
                  color: palette.secondary,
                  fontWeight: "600",
                }}
                onClick={() => handleBack("language")}
              >
                Back to Language
              </button>
            )}
          </div>
        </div>
      </nav>
      <main>
        <div
          className="container"
          style={{
            maxWidth: 1100,
            paddingTop: 110,
            paddingBottom: 60,
            minHeight: "80vh",
          }}
        >
          {/* Landing page: Language selection */}
          {step === "language" && (
            <div
              style={{
                display: "flex",
                marginTop: 48,
                gap: 40,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <div
                onClick={() => handleLanguage("Tamil")}
                tabIndex={0}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(120deg, #fde7eb 50%, #ff80e3 120%)",
                  borderRadius: 18,
                  padding: 40,
                  minWidth: 240,
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px 0 rgba(255,128,227,0.08)",
                  border: `2.5px solid ${palette.primary}`,
                  transition: "box-shadow 0.2s",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLanguage("Tamil");
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9858/9858033.png"
                  alt="Tamil icon"
                  style={{ width: 80, marginBottom: 16 }}
                  loading="lazy"
                />
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    letterSpacing: "-2px",
                    color: palette.accent,
                  }}
                >
                  Tamil
                </div>
              </div>
              <div
                onClick={() => handleLanguage("English")}
                tabIndex={0}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(120deg, #fde7eb 50%, #ff80e3 120%)",
                  borderRadius: 18,
                  padding: 40,
                  minWidth: 240,
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px 0 rgba(255,128,227,0.10)",
                  border: `2.5px solid ${palette.primary}`,
                  transition: "box-shadow 0.2s",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLanguage("English");
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/709/709786.png"
                  alt="English icon"
                  style={{ width: 80, marginBottom: 16 }}
                  loading="lazy"
                />
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    letterSpacing: "-2px",
                    color: palette.accent,
                  }}
                >
                  English
                </div>
              </div>
            </div>
          )}
          {/* Artist grid for selected language */}
          {step === "artist" && (
            <>
              <h2
                style={{
                  fontSize: 30,
                  marginBottom: 20,
                  marginTop: 12,
                  color: palette.accent,
                }}
              >
                Select an Artist ({language})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 30,
                  marginTop: 25,
                  justifyItems: "center",
                }}
              >
                {artistData[language].map((a) => (
                  <div
                    key={a.name}
                    onClick={() => handleArtistSelect(a)}
                    tabIndex={0}
                    style={{
                      background: palette.secondary,
                      border: `2.5px solid ${palette.accent}`,
                      borderRadius: 16,
                      padding: 20,
                      minHeight: 260,
                      width: "100%",
                      maxWidth: 256,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "box-shadow 0.2s",
                      boxShadow:
                        artist && artist.name === a.name
                          ? "0 4px 18px 0 rgba(76,83,93,0.10)"
                          : "0 2px 10px 0 rgba(76,83,93,0.08)",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleArtistSelect(a);
                    }}
                  >
                    <div style={{position:"relative"}}>
                      <img
                        src={a.image || placeholderImg}
                        alt={a.name}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginBottom: 16,
                          boxShadow: "0 2px 10px rgba(76,83,93,0.07)",
                          border: `3px solid ${palette.primary}`,
                          display: "block"
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: palette.accent,
                        letterSpacing: "-1.1px",
                        marginBottom: 6,
                      }}
                    >
                      {a.name}
                    </span>
                    <span
                      style={{
                        color: palette.primary,
                        fontWeight: 600,
                        fontSize: 15,
                        marginBottom: 4,
                        marginTop: 7,
                      }}
                    >{`${a.songs.length} Songs`}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn"
                style={{
                  marginTop: 40,
                  background: palette.primary,
                  color: palette.accent,
                  fontWeight: 600,
                }}
                onClick={() => handleBack("language")}
              >
                &larr; Back
              </button>
            </>
          )}
          {/* Song list for selected artist */}
          {step === "song" && (
            <>
              <h2
                style={{
                  fontSize: 26,
                  marginTop: 8,
                  marginBottom: 15,
                  color: palette.accent,
                  fontWeight: 600,
                }}
              >
                {artist ? (
                  <>
                    {artist.name}
                    <span
                      style={{
                        color: palette.primary,
                        fontWeight: 500,
                        fontSize: 15,
                        marginLeft: 18,
                      }}
                    >
                      ({artist.songs.length} Songs)
                    </span>
                  </>
                ) : (
                  "Songs"
                )}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginTop: 20,
                  alignItems: "flex-start",
                  background: "transparent",
                }}
              >
                {songs.map((s) => (
                  <button
                    className="btn"
                    key={s}
                    style={{
                      background: palette.primary,
                      color: palette.accent,
                      fontSize: 18,
                      width: "100%",
                      maxWidth: 540,
                      textAlign: "left",
                      padding: "16px 18px",
                      fontWeight: 700,
                      border: `2px solid ${palette.accent}`,
                    }}
                    onClick={() => handleSongSelect(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                className="btn"
                style={{
                  marginTop: 40,
                  background: palette.primary,
                  color: palette.accent,
                  fontWeight: 600,
                }}
                onClick={() => handleBack("artist")}
              >
                &larr; Back to Artists
              </button>
            </>
          )}
          {/* Lyrics and YouTube video for selected song */}
          {step === "lyrics" && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 32,
                  flexWrap: "wrap",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    minWidth: 220,
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  <div style={{position:"relative"}}>
                    <img
                      src={artist.image || placeholderImg}
                      alt={artist.name}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginBottom: 14,
                        boxShadow: "0 2px 10px rgba(76,83,93,0.11)",
                        border: `3px solid ${palette.primary}`,
                        display: "block"
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImg;
                      }}
                    />
                  </div>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 700,
                      color: palette.accent,
                      fontSize: 19,
                      marginBottom: 7,
                    }}
                  >
                    {artist.name}
                  </span>
                  <span
                    style={{
                      color: palette.primary,
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    {song}
                  </span>
                </div>
                {/* Only display lyrics box for English, not for Tamil */}
                {language === "English" && (
                  <div
                    style={{
                      background: "white",
                      color: palette.accent,
                      borderRadius: 12,
                      padding: 28,
                      minWidth: 240,
                      maxWidth: "calc(100% - 320px)",
                      boxShadow: "0 4px 20px 0 rgba(255,128,227,0.06)",
                      flex: 3,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: palette.primary,
                        marginBottom: 12,
                      }}
                    >
                      Lyrics
                    </div>
                    {lyricsLoading ? (
                      <div style={{ color: palette.accent, padding: 12 }}>
                        Fetching lyrics...
                      </div>
                    ) : lyricsError ? (
                      <div style={{ color: "#b50043", fontWeight: 600 }}>
                        {lyricsError}
                      </div>
                    ) : lyrics ? (
                      <pre
                        style={{
                          fontFamily: "inherit",
                          background: "#fafafa",
                          color: palette.accent,
                          borderRadius: 10,
                          fontSize: 15,
                          lineHeight: "1.7",
                          whiteSpace: "pre-wrap",
                          margin: 0,
                          maxHeight: 320,
                          overflowY: "auto",
                          boxShadow: "0 1px 3px rgba(76,83,93,0.04)",
                          padding: 16,
                        }}
                      >
                        {lyrics}
                      </pre>
                    ) : (
                      <div style={{ color: palette.accent }}>
                        Select a song to view lyrics.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div
                style={{
                  margin: "0 auto",
                  marginTop: 15,
                  marginBottom: 40,
                  background: palette.secondary,
                  padding: 28,
                  borderRadius: 15,
                  maxWidth: 600,
                  boxShadow: "0 2px 10px 0 rgba(255,128,227,0.08)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: 15,
                    color: palette.accent,
                    fontSize: 18,
                  }}
                >
                  Official Music Video
                </div>
                {ytLoading && (
                  <span
                    style={{
                      color: palette.accent,
                      fontWeight: 600,
                    }}
                  >
                    Loading video...
                  </span>
                )}
                {!ytLoading && ytVideoId && (
                  <iframe
                    width="420"
                    height="235"
                    src={`https://www.youtube.com/embed/${ytVideoId}`}
                    title="Music video"
                    style={{
                      border: "none",
                      borderRadius: 9,
                      boxShadow: "0 2px 8px rgba(76,83,93,0.16)",
                      background: "#000",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
                {!ytLoading && !ytVideoId && (
                  <span style={{ color: "#b50043", fontWeight: 700 }}>
                    No video found
                  </span>
                )}
              </div>
              <button
                className="btn"
                style={{
                  background: palette.primary,
                  color: palette.accent,
                  fontWeight: 600,
                  marginTop: 10,
                }}
                onClick={() => handleBack("song")}
              >
                &larr; Back to Songs
              </button>
            </>
          )}
        </div>
      </main>
      <footer
        style={{
          textAlign: "center",
          width: "100%",
          fontSize: 16,
          color: palette.accent,
          paddingBottom: 36,
        }}
      >
        <span style={{ color: palette.primary, fontWeight: 700 }}>
          MelodyMix
        </span>{" "}
        &copy; {new Date().getFullYear()} | For music fans
      </footer>
    </div>
  );
}

export default App;