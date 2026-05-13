import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import { LogIn, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — FumaOPS" }],
  }),
  component: Admin,
});

function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading)
    return (
      <PageShell>
        <div className="pt-32 text-center">Chargement...</div>
      </PageShell>
    );

  if (!user || user.email !== "khfuma@gmail.com") {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-5 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-6">Accès Réservé</h1>
          <p className="mb-8 text-muted-foreground">
            Vous devez être administrateur pour accéder à cette page.
          </p>
          {user ? (
            <div className="space-y-4">
              <p>Connecté avec : {user.email}</p>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-full glass hover:bg-white/10 transition"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white font-medium hover-lift"
            >
              <LogIn className="h-5 w-5" />
              Se connecter avec Google
            </button>
          )}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 pt-24 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold italic">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm rounded-full glass hover:bg-white/10 transition"
          >
            Déconnexion
          </button>
        </div>

        <div className="glass rounded-[2rem] p-8 md:p-12 text-center max-w-2xl mx-auto">
          <ShieldAlert className="h-16 w-16 text-[var(--neon)] mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Gestion du Portfolio</h2>
          <p className="text-muted-foreground mb-6">
            Comme demandé, l'ajout dynamique de projets via cette interface a été désactivé.
          </p>
          <div className="p-6 bg-white/5 rounded-2xl text-left border border-white/10">
            <p className="text-sm font-medium mb-2">Instructions :</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
              <li>Les photos du portfolio sont désormais gérées directement dans le code.</li>
              <li>
                Pour ajouter de nouveaux projets, veuillez m'envoyer les liens des images ou
                fichiers.
              </li>
              <li>
                Je mettrai à jour la liste statique dans{" "}
                <code className="text-[var(--neon)]">src/lib/constants.ts</code>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
