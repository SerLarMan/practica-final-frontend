function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="container-app py-8 flex sm:flex-row items-center justify-center">
        <p className="text-sm text-gray-600">
          © {year} Kernel Co. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
