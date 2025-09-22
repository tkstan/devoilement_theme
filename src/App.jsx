import React, { useEffect, useMemo, useRef, useState } from "react";
import devoilements from "./devoilements";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import ScratchSurface from "./components/ScratchSurface";

const App = () => {
  const scratchCardRef = useRef(null);
  const [selectedId, setSelectedId] = useState(() => devoilements[0]?.id ?? null);
  const [isRevealed, setIsRevealed] = useState(false);

  const selectedReveal = useMemo(
    () => devoilements.find((item) => item.id === selectedId) ?? null,
    [selectedId]
  );

  useEffect(() => {
    if (!selectedReveal) {
      return;
    }
    setIsRevealed(false);
    if (scratchCardRef.current && typeof scratchCardRef.current.reset === "function") {
      scratchCardRef.current.reset();
    }
  }, [selectedReveal]);

  if (!selectedReveal) {
    return (
      <div className="app app--empty">
        <div className="app__overlay">
          <p className="app__empty-message">
            Aucun dévoilement disponible pour le moment. Ajoutez un nouveau dossier dans
            <code>src/devoilements</code> pour commencer.
          </p>
        </div>
      </div>
    );
  }

  const {
    announcement,
    theme,
    subtitle,
    title,
    scratchSettings,
    timeline,
    resources,
    background,
  } = selectedReveal;

  const backgroundStyle =
    background ??
    "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), rgba(15,23,42,0.95) 65%)";

  const handleResetScratch = () => {
    if (scratchCardRef.current && typeof scratchCardRef.current.reset === "function") {
      scratchCardRef.current.reset();
    }
    setIsRevealed(false);
  };

  return (
    <div className="app" style={{ background: backgroundStyle }}>
      <div className="app__overlay">
        <aside className="app__sidebar">
          <h1 className="app__title">Dévoilements successifs</h1>
          <p className="app__subtitle">
            Explorez chaque édition et grattez la carte pour révéler le thème correspondant.
          </p>
          <ul className="app__list">
            {devoilements.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`app__list-button${item.id === selectedReveal.id ? " app__list-button--active" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="app__list-title">{item.title}</span>
                  <span className="app__list-theme">{item.theme}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="app__main">
          <Card className="scratch-card">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="scratch-card__stage"
                style={{
                  width: `${scratchSettings.width}px`,
                  height: `${scratchSettings.height}px`,
                }}
              >
                <div className="scratch-card__reveal">
                  <span className="scratch-card__eyebrow">{theme}</span>
                  <h3 className="scratch-card__headline">{announcement.headline}</h3>
                  <p className="scratch-card__message">{announcement.message}</p>
                  <ul className="scratch-card__highlights">
                    {announcement.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <ScratchSurface
                  ref={scratchCardRef}
                  width={scratchSettings.width}
                  height={scratchSettings.height}
                  brushSize={scratchSettings.brushSize}
                  finishPercent={scratchSettings.finishPercent}
                  coverImage={scratchSettings.coverImage}
                  coverColor={scratchSettings.coverColor}
                  onComplete={() => setIsRevealed(true)}
                  className="scratch-card__mask"
                />
                {!isRevealed && (
                  <div className="scratch-card__hint">
                    <span>Grattez pour dévoiler le thème</span>
                  </div>
                )}
              </div>
              <section className="scratch-card__section">
                <h4>Moments clés de l'édition</h4>
                <ul className="scratch-card__timeline">
                  {timeline.map((step) => (
                    <li key={step.label}>
                      <span className="scratch-card__timeline-label">{step.label}</span>
                      <p className="scratch-card__timeline-description">{step.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </CardContent>
            <CardFooter>
              <div className="scratch-card__footer">
                <div className="scratch-card__resources">
                  <h4>Ressources utiles</h4>
                  <ul>
                    {resources.map((resource) => (
                      <li key={resource.href}>
                        <a href={resource.href} target="_blank" rel="noreferrer">
                          {resource.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="scratch-card__actions">
                  <button type="button" className="button" onClick={handleResetScratch}>
                    Réinitialiser la carte
                  </button>
                  {isRevealed && <span className="badge">Thème dévoilé</span>}
                </div>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default App;
