import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./store/store";
import LandingPage from "./pages/landing-page/LandingPage.page";
import ErrorPage from "./pages/error-page/ErrorPage.page";
import LoginPage from "./pages/login-page/LoginPage.page";
import RegisterPage from "./pages/register-page/RegisterPage.page";
import CharacterCreation from "./pages/character-creation/CharacterCreationPage.page";
import HomePage from "./pages/home-page/HomePage.page";
import RootLayout from "./layout/RootLayout.layout";
import SkillsPage from "./pages/skills-page/SkillsPage.page";
import QuestsPage from "./pages/quests-page/QuestsPage.page";
import QuestCreationForm from "./components/create-quest-form/CreateQuestForm.component";
import QuestDetailPage from "./pages/quest-detail-page/QuestDetailPage.page";
import CharacterProfile from "./pages/character-page/CharacterProfile.page";
import ModalProvider from "./modal-provider/ModalProvider.provider";
import GearInventory from "./pages/gear-inventory/GearInventory.component";

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
      errorElement: <ErrorPage />
    },
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'register',
      element: <RegisterPage />
    },
    {
      path: 'create-character',
      element: <CharacterCreation />
    },
    {
      path: 'character',
      element: <CharacterProfile />
    },
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: 'home',
          element: <HomePage />
        },
        {
          path: 'skills',
          element: <SkillsPage />
        },
        {
          path: 'quests',
          element: <QuestsPage />
        },
        {
          path: 'create-quest',
          element: <QuestCreationForm />
        },
        {
          path: 'quests/:questId',
          element: <QuestDetailPage />
        },
        {
          path: 'inventory',
          element: <GearInventory />
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

function WrappedApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </PersistGate>
    </Provider>
  );
}

export default WrappedApp;
