import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_COORDS = { lat: 22.3149, lng: 87.3105 }; // Default India center / Kharagpur

// Custom inline SVG marker icon so Leaflet never breaks marker images in production builds
const createPinIcon = () =>
  L.divIcon({
    className: "suraksha-map-pin",
    html: `<svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,0.35))">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#2563EB"/>
      <circle cx="16" cy="16" r="6.5" fill="#FFFFFF"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42]
  });

export default function MadadLocationTracker({
  isHi,
  location,
  setLocation,
  landmark,
  setLandmark,
  onToast
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);

  const [locating, setLocating] = useState(false);
  const [locSource, setLocSource] = useState(location ? "saved" : "unset"); // 'gps' | 'pin' | 'search' | 'saved' | 'unset'
  const [accuracy, setAccuracy] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [gpsWarning, setGpsWarning] = useState("");
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("just now");

  const activeCoords = location || DEFAULT_COORDS;

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [activeCoords.lat, activeCoords.lng],
      zoom: zoomLevel,
      zoomControl: true,
      attributionControl: true
    });

    // Use Esri World Street Map tiles (zero API key, maxNativeZoom: 17 prevents "Map data not yet available" at zoom 18-19)
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P",
        maxNativeZoom: 17,
        maxZoom: 19
      }
    ).addTo(map);

    const marker = L.marker([activeCoords.lat, activeCoords.lng], {
      draggable: true,
      icon: createPinIcon()
    }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      const next = {
        lat: Number(pos.lat.toFixed(6)),
        lng: Number(pos.lng.toFixed(6))
      };
      setLocation(next);
      setLocSource("pin");
      setAccuracy(null);
      setGpsWarning("");
      setLastUpdatedLabel(isHi ? "अभी" : "just now");
    });

    map.on("click", (e) => {
      const next = {
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6))
      };
      marker.setLatLng([next.lat, next.lng]);
      setLocation(next);
      setLocSource("pin");
      setAccuracy(null);
      setGpsWarning("");
      setLastUpdatedLabel(isHi ? "अभी" : "just now");
    });

    map.on("zoomend", () => {
      setZoomLevel(map.getZoom());
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Attempt initial GPS lock silently if in a secure context
    if (navigator.geolocation && window.isSecureContext) {
      requestLiveGPS(true);
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync map & marker when location changes externally (e.g. GPS or Search)
  useEffect(() => {
    if (!location || !mapInstanceRef.current || !markerRef.current) return;
    const currentPos = markerRef.current.getLatLng();
    if (
      Math.abs(currentPos.lat - location.lat) > 0.000001 ||
      Math.abs(currentPos.lng - location.lng) > 0.000001
    ) {
      markerRef.current.setLatLng([location.lat, location.lng]);
      mapInstanceRef.current.setView([location.lat, location.lng], Math.min(Math.max(mapInstanceRef.current.getZoom(), 15), 17), {
        animate: true
      });
    }
  }, [location]);

  // Request Live High-Accuracy GPS
  const requestLiveGPS = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) {
        setGpsWarning(
          isHi
            ? "इस डिवाइस पर GPS उपलब्ध नहीं है — मैप पर टैप करके पिन सेट करें।"
            : "GPS is not available on this device — tap the map or search your area."
        );
      }
      return;
    }

    if (!window.isSecureContext) {
      const msg = isHi
        ? "मोबाइल पर HTTP लिंक होने के कारण ब्राउज़र लाइव GPS ब्लॉक कर सकता है। मैप पर टैप/ड्रैग करें या नीचे अपना इलाका/पिनकोड खोजें।"
        : "Browser blocks live GPS on non-HTTPS Wi-Fi links. Tap/drag the map pin or search your area/pincode below.";
      setGpsWarning(msg);
      if (!silent) onToast(msg);
      return;
    }

    setLocating(true);
    setGpsWarning("");

    // Clear previous watch if active
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6))
        };
        setLocation(next);
        setAccuracy(Math.round(pos.coords.accuracy || 0));
        setLocSource("gps");
        setLocating(false);
        setLastUpdatedLabel(isHi ? "लाइव" : "live");
        if (!silent) {
          onToast(isHi ? "सटीक GPS लोकेशन मिल गई!" : "Exact GPS location locked!");
        }

        // Start continuous watch for exact live tracking
        watchIdRef.current = navigator.geolocation.watchPosition(
          (wPos) => {
            setLocation({
              lat: Number(wPos.coords.latitude.toFixed(6)),
              lng: Number(wPos.coords.longitude.toFixed(6))
            });
            setAccuracy(Math.round(wPos.coords.accuracy || 0));
            setLocSource("gps");
            setLastUpdatedLabel(isHi ? "लाइव" : "live");
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        );
      },
      (err) => {
        setLocating(false);
        if (!silent) {
          const msg =
            err.code === 1
              ? isHi
                ? "लोकेशन की अनुमति नहीं मिली। ब्राउज़र में Location Allow करें या मैप पर पिन सेट करें।"
                : "Location permission denied. Allow GPS in browser settings or tap the map to pin."
              : isHi
              ? "GPS सिग्नल नहीं मिला। मैप पर पिन सेट करें या इलाका खोजें।"
              : "Could not get GPS signal. Tap the map or search your area below.";
          setGpsWarning(msg);
          onToast(msg);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  // Search area, pincode, or pasted lat, lng
  const handleSearchArea = async (e) => {
    e.preventDefault();
    const raw = searchText.trim();
    if (!raw) return;

    // 1. Check if user pasted "lat, lng" directly
    const coordMatch = raw.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (coordMatch) {
      const lat = Number(parseFloat(coordMatch[1]).toFixed(6));
      const lng = Number(parseFloat(coordMatch[2]).toFixed(6));
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setLocation({ lat, lng });
        setLocSource("pin");
        setAccuracy(null);
        setGpsWarning("");
        setLastUpdatedLabel(isHi ? "अभी" : "just now");
        onToast(isHi ? "पिन सटीक कोऑर्डिनेट्स पर सेट हो गया" : "Pin moved to exact coordinates");
        return;
      }
    }

    // 2. Otherwise search via OpenStreetMap Nominatim (when online)
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        raw
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const lat = Number(parseFloat(data[0].lat).toFixed(6));
        const lng = Number(parseFloat(data[0].lon).toFixed(6));
        setLocation({ lat, lng });
        setLocSource("search");
        setAccuracy(null);
        setGpsWarning("");
        setLastUpdatedLabel(isHi ? "अभी" : "just now");
        onToast(isHi ? "जगह मिल गई — मैप पिन अपडेट हो गया" : "Area found — map pin updated");
      } else {
        onToast(isHi ? "यह जगह नहीं मिली, थोड़ा स्पष्ट लिखें" : "Area not found — try a nearby landmark or pincode");
      }
    } catch {
      onToast(isHi ? "ऑफ़लाइन हैं — मैप पर टैप करके या lat, lng लिखकर पिन सेट करें" : "Offline — tap the map or paste lat, lng directly");
    } finally {
      setSearching(false);
    }
  };

  const handleCopyLocation = () => {
    const coordsStr = `${activeCoords.lat.toFixed(6)}, ${activeCoords.lng.toFixed(6)}`;
    const link = `https://maps.google.com/?q=${activeCoords.lat.toFixed(6)},${activeCoords.lng.toFixed(6)}`;
    const text = landmark
      ? `${coordsStr}\n${landmark}\n${link}`
      : `${coordsStr}\n${link}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => onToast(isHi ? "लोकेशन कॉपी हो गई" : "Location copied"),
        () => onToast(isHi ? "कॉपी नहीं हुआ" : "Copy failed")
      );
    }
  };

  const badgeLabel =
    locSource === "gps"
      ? isHi
        ? "लाइव GPS"
        : "Live GPS"
      : locSource === "pin" || locSource === "search" || locSource === "saved"
      ? isHi
        ? "सटीक पिन सेट"
        : "Exact Pin Set"
      : isHi
      ? "डिफ़ॉल्ट पिन"
      : "Default Pin";

  return (
    <div className="madad-loc-box">
      {/* Top Header Row */}
      <div className="madad-loc-top">
        <div className="madad-loc-status-wrap">
          <span
            className={`madad-loc-dot ${
              locating ? "locating" : location ? "locked" : ""
            }`}
            aria-hidden="true"
          ></span>
          <b className="madad-loc-title">
            {locating
              ? isHi
                ? "लोकेशन ढूँढ रहे हैं..."
                : "Locating..."
              : location
              ? isHi
                ? "सटीक लोकेशन सेट है"
                : "Exact Location Set"
              : isHi
              ? "लोकेशन सेट करें"
              : "Set Your Location"}
          </b>
          <span className="madad-loc-pill">{badgeLabel}</span>
          <span className="madad-loc-time">• {lastUpdatedLabel}</span>
        </div>

        <button
          type="button"
          className="madad-locate-btn"
          onClick={() => requestLiveGPS(false)}
          disabled={locating}
        >
          📍 {locating ? (isHi ? "खोज रहे हैं..." : "Locating...") : isHi ? "मेरी लोकेशन" : "Locate Me"}
        </button>
      </div>

      {/* Coordinates Pill & Caption */}
      <div className="madad-coords-row">
        <span className="madad-coords-pill">
          {activeCoords.lat.toFixed(6)}, {activeCoords.lng.toFixed(6)}
        </span>
        <div className="madad-coords-sub">
          {gpsWarning ? (
            <span style={{ color: "#9A3412" }}>{gpsWarning}</span>
          ) : accuracy ? (
            isHi
              ? `सटीक GPS लॉक (±${accuracy}m सटीकता)।`
              : `Exact GPS coordinates locked (±${accuracy}m accuracy).`
          ) : isHi ? (
            "सटीक कोऑर्डिनेट्स लॉक और तैयार हैं।"
          ) : (
            "Exact coordinates locked and ready."
          )}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="madad-map-wrap">
        <div ref={mapContainerRef} className="madad-map-canvas" />
      </div>
      <div className="madad-map-hint">
        <span>
          {isHi ? "सटीक जगह चुनने के लिए मैप पर टैप करें या पिन खींचें" : "Tap map or drag pin to adjust exact spot"}
        </span>
        <span>
          {isHi ? `स्ट्रीट व्यू (ज़ूम ${zoomLevel})` : `Street view (Zoom ${zoomLevel})`}
        </span>
      </div>

      {/* Quick Action Pills */}
      <div className="madad-loc-actions">
        <a
          className="madad-loc-action-btn"
          href={`https://maps.google.com/?q=${activeCoords.lat.toFixed(6)},${activeCoords.lng.toFixed(6)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🗺️ {isHi ? "Google Maps खोलें" : "Open Google Maps"}
        </a>
        <a
          className="madad-loc-action-btn"
          href={`https://www.google.com/maps/search/hospital/@${activeCoords.lat.toFixed(6)},${activeCoords.lng.toFixed(6)},15z`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🏥 {isHi ? "नज़दीकी अस्पताल" : "Nearest Hospital"}
        </a>
        <button
          type="button"
          className="madad-loc-action-btn"
          onClick={handleCopyLocation}
        >
          📋 {isHi ? "लोकेशन कॉपी करें" : "Copy Location"}
        </button>
      </div>

      {/* Area / Pincode / Lat,Lng Search */}
      <form className="madad-loc-search" onSubmit={handleSearchArea}>
        <label htmlFor="madadAreaSearch" className="madad-loc-label">
          {isHi
            ? "सटीक इलाका, पिनकोड खोजें या lat, lng पेस्ट करें (जैसे 721302, IIT Gate)"
            : "Search exact area, pincode, or paste lat, lng (e.g. 721302, IIT Gate)"}
        </label>
        <div className="madad-loc-search-row">
          <input
            id="madadAreaSearch"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              isHi
                ? "इलाका, पिनकोड या lat, lng लिखें..."
                : "Search exact area, pincode, or paste lat, lng (e.g. 721302, IIT Gate)"
            }
          />
          <button type="submit" className="madad-find-btn" disabled={searching}>
            {searching ? "..." : isHi ? "खोजें" : "Find"}
          </button>
        </div>
      </form>

      {/* Offline Backup Landmark */}
      <div className="madad-loc-landmark">
        <label htmlFor="madadLandmark" className="madad-loc-label">
          {isHi
            ? "बैकअप पहचान / पता (डिवाइस पर ऑफ़लाइन सेव रहता है)"
            : "Backup landmark / address (saved offline on device)"}
        </label>
        <input
          id="madadLandmark"
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder={
            isHi
              ? "जैसे स्टेशन रोड के पास, सेक्टर 4, खड़गपुर"
              : "e.g. Near Station Road, Sector 4, Kharagpur"
          }
        />
      </div>
    </div>
  );
}
