import React, { useState, useEffect } from "react";
import "./App.css";

// PUBLIC_INTERFACE
/**
 * Core MelodyMix app container with views for language/artist/song/lyrics/video flows.
 */
function App() {
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
  const artistData = {
    Tamil: [
      {
        name: "Harris Jayaraj",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/4/4a/Harris_Jayaraj_at_the_Anegan_Audio_Launch.jpg",
        songs: [
          "Vaseegara",
          "Uyirin Uyire",
          "Hasili Fisili",
          "Anbil Avan"
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
          "Imaye Imaye"
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
          "Thangamey"
        ],
      },
      {
        name: "Anirudh Ravichandar",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/9f/Anirudh_Ravichander.png",
        songs: [
          "Why This Kolaveri Di",
          "Surviva",
          "Kanave Kanave",
          "Vaathi Coming"
        ],
      },
    ],
    English: [
      {
        name: "Taylor Swift",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/f/f2/Taylor_Swift_Red_Tour_5_cropped.jpg",
        songs: [
          "Love Story",
          "Blank Space",
          "Shake It Off",
          "You Belong With Me",
        ],
      },
      {
        name: "Ed Sheeran",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/4/45/Ed_Sheeran_2013.jpg",
        songs: [
          "Shape of You",
          "Perfect",
          "Thinking Out Loud",
          "Photograph",
        ],
      },
      {
        name: "Adele",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/6/6b/Adele_2016.jpg",
        songs: [
          "Hello",
          "Someone Like You",
          "Rolling in the Deep",
          "Set Fire to the Rain",
        ],
      },
      {
        name: "Bruno Mars",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/1/16/BrunoMars24KMagicWorldTourLive_Lucca_2018_%2840%29_%2833029844978%29.jpg",
        songs: [
          "Just The Way You Are",
          "Grenade",
          "Uptown Funk",
          "That's What I Like",
        ],
      },
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

  // Fetch lyrics when song selected
  useEffect(() => {
    if (!artist || !song) return;
    if (step !== "lyrics") return;
    setLyricsLoading(true);
    setLyricsError(null);
    fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(
        artist.name
      )}/${encodeURIComponent(song)}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.lyrics) setLyrics(d.lyrics);
        else setLyricsError("Lyrics not found.");
      })
      .catch(() => setLyricsError("Lyrics unavailable."))
      .finally(() => setLyricsLoading(false));
  }, [artist, song, step]);

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
                    <img
                      src={a.image}
                      alt={a.name}
                      style={{
                        width: 110,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginBottom: 16,
                        boxShadow: "0 2px 10px rgba(76,83,93,0.07)",
                        border: `3px solid ${palette.primary}`,
                      }}
                      loading="lazy"
                    />
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
                  <img
                    src={artist.image}
                    alt={artist.name}
                    style={{
                      width: 125,
                      height: 125,
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginBottom: 14,
                      boxShadow: "0 2px 10px rgba(76,83,93,0.11)",
                      border: `3px solid ${palette.primary}`,
                    }}
                    loading="lazy"
                  />
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