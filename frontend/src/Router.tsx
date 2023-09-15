import { ActionFunction, createBrowserRouter, LoaderFunction, RouterProvider } from "react-router-dom";

interface Route {
  Element: React.ElementType;
  path?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
}
const pages = import.meta.glob<{ default: React.ElementType }>("./pages/**/*.tsx", { eager: true });

const routes: Route[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }
  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  routes.push({
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
    Element: pages[path].default,
    // loader: pages[path]?.loader,
    // action: pages[path]?.action,
  });

}

const router = createBrowserRouter(
  routes.map(({ Element, ...rest }) => ({
    ...rest,
    element: <Element />,
  }))
);

const Router = () => {
  return <RouterProvider router={router} />;
};
export default Router