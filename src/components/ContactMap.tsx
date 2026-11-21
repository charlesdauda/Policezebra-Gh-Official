const ContactMap = () => {
  return (
    <section className="pb-14 sm:pb-20">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-(--black)">
              <span className="h-px w-8 bg-(--navy)" aria-hidden="true" />
              Visit us
            </span>
            <h2 className="mt-3 text-[28px] font-semibold uppercase leading-none tracking-[0.01em] text-(--black) sm:text-[36px]">
              Find us on the map
            </h2>
          </div>

          
        </div>

        <div className="overflow-hidden rounded-xl border border-(--border) bg-(--white)">
          <iframe
            title="Police Zebra location on Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.626041468393!2d-0.17822102271046084!3d5.6221002798138295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b13b0062aad%3A0x75de9717e31b2442!2sAccra%20Mall!5e0!3m2!1sen!2sgh!4v1795047625891!5m2!1sen!2sgh"
            className="block h-90 w-full border-0 sm:h-110 lg:h-125"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactMap;