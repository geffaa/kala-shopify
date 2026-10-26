var te={"/repo/theme/config/settings_data.json":`{
  "current": "Default",
  "presets": {
    "Default": {
      "wordmark": "KALA",
      "color_paper": "#EEEBE4",
      "color_ink": "#131312",
      "color_muted": "#5F5C55",
      "color_rule": "#CFCAC0",
      "color_signal": "#D9461B",
      "card_ratio": "4 / 5",
      "card_hover_image": true,
      "card_quick_add": true,
      "low_stock_threshold": 5,
      "cart_type": "drawer",
      "free_shipping_threshold": 750000,
      "cart_note": true,
      "back_in_stock_endpoint": "/apps/kala/back-in-stock"
    }
  }
}
`,"/repo/theme/config/settings_schema.json":`[
  {
    "name": "theme_info",
    "theme_name": "Kala",
    "theme_version": "1.0.0",
    "theme_author": "Yodhimas Geffananda",
    "theme_documentation_url": "https://github.com/",
    "theme_support_url": "https://github.com/"
  },
  {
    "name": "Brand",
    "settings": [
      {
        "type": "text",
        "id": "wordmark",
        "label": "Wordmark",
        "default": "KALA",
        "info": "Used when no logo image is set."
      },
      {
        "type": "image_picker",
        "id": "logo",
        "label": "Logo image"
      },
      {
        "type": "range",
        "id": "logo_width",
        "label": "Logo width",
        "min": 60,
        "max": 240,
        "step": 4,
        "unit": "px",
        "default": 96
      },
      {
        "type": "image_picker",
        "id": "favicon",
        "label": "Favicon",
        "info": "32 \xD7 32px PNG recommended."
      }
    ]
  },
  {
    "name": "Colors",
    "settings": [
      {
        "type": "paragraph",
        "content": "The palette is intentionally small. Signal is reserved for time-sensitive information: countdowns, low stock, sale prices."
      },
      { "type": "color", "id": "color_paper", "label": "Paper", "default": "#EEEBE4" },
      { "type": "color", "id": "color_ink", "label": "Ink", "default": "#131312" },
      { "type": "color", "id": "color_muted", "label": "Muted text", "default": "#5F5C55" },
      { "type": "color", "id": "color_rule", "label": "Rules & borders", "default": "#CFCAC0" },
      { "type": "color", "id": "color_signal", "label": "Signal", "default": "#D9461B" }
    ]
  },
  {
    "name": "Product cards",
    "settings": [
      {
        "type": "select",
        "id": "card_ratio",
        "label": "Image ratio",
        "options": [
          { "value": "4 / 5", "label": "Portrait 4:5" },
          { "value": "3 / 4", "label": "Portrait 3:4" },
          { "value": "1 / 1", "label": "Square" }
        ],
        "default": "4 / 5"
      },
      { "type": "checkbox", "id": "card_hover_image", "label": "Show second image on hover", "default": true },
      {
        "type": "checkbox",
        "id": "card_quick_add",
        "label": "Enable quick add",
        "default": true,
        "info": "Shows size buttons on cards for products with a single option."
      }
    ]
  },
  {
    "name": "Inventory",
    "settings": [
      {
        "type": "range",
        "id": "low_stock_threshold",
        "label": "Low stock threshold",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 5,
        "info": "Variants at or below this quantity show a remaining count."
      }
    ]
  },
  {
    "name": "Cart",
    "settings": [
      {
        "type": "select",
        "id": "cart_type",
        "label": "Add to cart behaviour",
        "options": [
          { "value": "drawer", "label": "Open drawer" },
          { "value": "page", "label": "Go to cart page" }
        ],
        "default": "drawer"
      },
      {
        "type": "number",
        "id": "free_shipping_threshold",
        "label": "Free shipping threshold",
        "info": "In the store's default currency. Leave empty to hide the progress meter. Hidden automatically when a customer browses in another currency.",
        "default": 750000
      },
      { "type": "checkbox", "id": "cart_note", "label": "Enable order note", "default": true }
    ]
  },
  {
    "name": "Integrations",
    "settings": [
      {
        "type": "text",
        "id": "back_in_stock_endpoint",
        "label": "Back-in-stock endpoint",
        "default": "/apps/kala/back-in-stock",
        "info": "App proxy path handled by the Kala ops service. See ops/README.md."
      }
    ]
  },
  {
    "name": "Social",
    "settings": [
      { "type": "text", "id": "social_instagram", "label": "Instagram URL" },
      { "type": "text", "id": "social_tiktok", "label": "TikTok URL" }
    ]
  }
]
`,"/repo/theme/layout/password.liquid":`<!doctype html>
<html lang="{{ request.locale.iso_code }}" class="no-js">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="{{ settings.color_ink }}">
    <link rel="canonical" href="{{ canonical_url }}">
    {{ 'archivo-var.woff2' | asset_url | preload_tag: as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }}
    <title>{{ shop.name }}</title>
    {%- if page_description -%}<meta name="description" content="{{ page_description | escape }}">{%- endif -%}
    {%- render 'meta-tags' -%}
    {%- render 'theme-tokens' -%}
    {{ 'base.css' | asset_url | stylesheet_tag }}
    <script type="application/json" id="theme-config">
      { "routes": {}, "strings": { "countdown": [
        {{ 'general.countdown.days' | t | json }}, {{ 'general.countdown.hours' | t | json }},
        {{ 'general.countdown.minutes' | t | json }}, {{ 'general.countdown.seconds' | t | json }}
      ] } }
    <\/script>
    <script src="{{ 'global.js' | asset_url }}" type="module"><\/script>
    {{ content_for_header }}
  </head>
  <body class="scheme-ink">
    <main id="main">{{ content_for_layout }}</main>
  </body>
</html>
`,"/repo/theme/layout/theme.liquid":`<!doctype html>
<html lang="{{ request.locale.iso_code }}" class="no-js">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="{{ settings.color_paper }}">
    <link rel="canonical" href="{{ canonical_url }}">

    {%- comment -%}
      One variable font file (wght 100\u2013900, wdth 62\u2013125, latin subset, 90 KB)
      replaces what would otherwise be 4\u20136 static files. Preloaded so the
      display type is ready before first paint on most connections.
    {%- endcomment -%}
    {{ 'archivo-var.woff2' | asset_url | preload_tag: as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }}

    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 64, height: 64 }}">
    {%- endif -%}

    <title>
      {{- page_title -}}
      {%- if current_tags -%}{%- assign joined_tags = current_tags | join: ', ' %} &ndash; {{ 'general.meta.tags' | t: tags: joined_tags }}{% endif -%}
      {%- if current_page != 1 %} &ndash; {{ 'general.meta.page' | t: page: current_page }}{% endif -%}
      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
    </title>
    {%- if page_description -%}
      <meta name="description" content="{{ page_description | escape }}">
    {%- endif -%}

    {%- render 'meta-tags' -%}
    {%- render 'theme-tokens' -%}

    {{ 'base.css' | asset_url | stylesheet_tag }}

    <script>
      document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
    <\/script>
    <script type="application/json" id="theme-config">
      {
        "routes": {
          "root": {{ routes.root_url | json }},
          "cart": {{ routes.cart_url | json }},
          "cartAdd": {{ routes.cart_add_url | json }},
          "cartChange": {{ routes.cart_change_url | json }},
          "predictiveSearch": {{ routes.predictive_search_url | json }},
          "recommendations": {{ routes.product_recommendations_url | json }}
        },
        "cartType": {{ settings.cart_type | json }},
        "backInStockEndpoint": {{ settings.back_in_stock_endpoint | json }},
        "strings": {
          "addToCart": {{ 'products.product.add_to_cart' | t | json }},
          "soldOut": {{ 'products.product.sold_out' | t | json }},
          "unavailable": {{ 'products.product.unavailable' | t | json }},
          "cartError": {{ 'cart.general.error' | t | json }},
          "added": {{ 'products.product.added' | t | json }},
          "countdown": [
            {{ 'general.countdown.days' | t | json }},
            {{ 'general.countdown.hours' | t | json }},
            {{ 'general.countdown.minutes' | t | json }},
            {{ 'general.countdown.seconds' | t | json }}
          ]
        }
      }
    <\/script>
    <script src="{{ 'global.js' | asset_url }}" type="module"><\/script>

    {{ content_for_header }}
  </head>

  <body class="template-{{ template.name | handle }}">
    <a class="skip-link t-label" href="#main">{{ 'accessibility.skip_to_content' | t }}</a>

    {% sections 'header-group' %}

    <main id="main" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>

    {% sections 'footer-group' %}

    {%- if settings.cart_type == 'drawer' -%}
      {% section 'cart-drawer' %}
    {%- endif -%}

    <div class="toast" role="status" aria-live="polite" data-toast hidden></div>
  </body>
</html>
`,"/repo/theme/locales/en.default.json":`{
  "accessibility": {
    "skip_to_content": "Skip to content"
  },
  "general": {
    "close": "Close",
    "view_all": "View all",
    "meta": {
      "tags": "Tagged \\"{{ tags }}\\"",
      "page": "Page {{ page }}"
    },
    "countdown": {
      "days": "Days",
      "hours": "Hrs",
      "minutes": "Min",
      "seconds": "Sec"
    }
  },
  "header": {
    "menu": "Menu",
    "search": "Search",
    "account": "Account",
    "cart": "Bag",
    "primary_navigation": "Primary"
  },
  "newsletter": {
    "label": "Email",
    "placeholder": "Email address",
    "submit": "Notify me",
    "success": "Noted. One email when the next drop opens."
  },
  "localization": {
    "country": "Ship to",
    "update": "Update"
  },
  "onboarding": {
    "product_title": "Product title"
  },
  "password": {
    "enter_store": "Enter with password",
    "label": "Password",
    "enter": "Enter",
    "notify": "Notify me",
    "admin_link_html": "Store owner? <a href=\\"{{ link }}\\" class=\\"link\\">Log in here</a>"
  },
  "products": {
    "product": {
      "add_to_cart": "Add to bag",
      "added": "Added to bag",
      "sold_out": "Sold out",
      "unavailable": "Unavailable",
      "add_variant": "Add {{ product }} in {{ variant }} to bag",
      "quick_add": "Quick add",
      "quick_add_option": "Add \u2014 choose {{ option }}",
      "color_count": {
        "one": "{{ count }} colour",
        "other": "{{ count }} colours"
      },
      "last_units": {
        "one": "Last {{ count }}",
        "other": "Last {{ count }}"
      },
      "from_price": "From {{ price }}",
      "regular_price": "Regular price",
      "sale_price": "Sale price",
      "tax_included": "Tax included",
      "gallery_label": "Product images",
      "size_guide": "Size guide",
      "size_guide_missing": "Measurements for this piece are coming soon. Message us and we'll measure it for you.",
      "fit": "Fit",
      "description": "Description",
      "material_care": "Material & care",
      "material": "Material",
      "origin": "Made in",
      "care": "Care",
      "pairs_with": "Pairs with"
    },
    "inventory": {
      "in_stock": "In stock \u2014 ships in 1\u20132 working days",
      "low": {
        "one": "Only {{ count }} left in this size",
        "other": "Only {{ count }} left in this size"
      },
      "preorder": "Pre-order \u2014 ships when the next batch is finished",
      "sold_out": "Sold out in this option"
    },
    "back_in_stock": {
      "heading": "Get one email if {{ variant }} comes back",
      "submit": "Notify me"
    }
  },
  "cart": {
    "general": {
      "title": "Bag",
      "items": {
        "one": "{{ count }} item",
        "other": "{{ count }} items"
      },
      "empty": "Your bag is empty.",
      "continue": "Browse the drop",
      "checkout": "Check out",
      "view_cart": "View bag",
      "subtotal": "Subtotal",
      "note": "Order note",
      "taxes_and_shipping": "Taxes included. Shipping calculated at checkout.",
      "remove": "Remove",
      "decrease": "Decrease quantity for {{ product }}",
      "increase": "Increase quantity for {{ product }}",
      "quantity_for": "Quantity for {{ product }}",
      "error": "Something went wrong. Please try again."
    },
    "shipping": {
      "remaining_html": "{{ amount }} away from free shipping",
      "unlocked": "Free shipping unlocked",
      "progress_label": "Progress to free shipping"
    }
  },
  "collections": {
    "general": {
      "items_count": {
        "one": "{{ count }} item",
        "other": "{{ count }} items"
      },
      "count": {
        "one": "{{ count }} collection",
        "other": "{{ count }} collections"
      },
      "all": "All collections",
      "load_more": "Load more",
      "no_matches": "Nothing matches those filters.",
      "products": "Products"
    },
    "filters": {
      "title": "Filter",
      "apply": "Apply",
      "clear_all": "Clear all",
      "remove": "Remove filter",
      "show_results": "Show results",
      "from": "From",
      "to": "To"
    },
    "sorting": {
      "title": "Sort"
    }
  },
  "search": {
    "title": "Search",
    "label": "Search the store",
    "placeholder": "Search",
    "submit": "Search",
    "suggestions": "Suggestions",
    "products": "Products",
    "collections": "Collections",
    "view_all": "All results for \u201C{{ terms }}\u201D",
    "results_count": {
      "one": "{{ count }} result for \u201C{{ terms }}\u201D",
      "other": "{{ count }} results for \u201C{{ terms }}\u201D"
    },
    "no_results": "No results for \u201C{{ terms }}\u201D."
  },
  "sections": {
    "archive": {
      "available": "Available",
      "sold_out": "Sold out",
      "upcoming": "Upcoming"
    },
    "lookbook": {
      "count": {
        "one": "{{ count }} piece",
        "other": "{{ count }} pieces"
      },
      "pin_label": "{{ number }} \u2014 {{ product }}"
    }
  },
  "blogs": {
    "article": {
      "count": {
        "one": "{{ count }} entry",
        "other": "{{ count }} entries"
      }
    }
  },
  "templates": {
    "404": {
      "title": "Not here.",
      "subtext": "This page sold out, moved, or never existed. The current drop is still open."
    }
  }
}`,"/repo/theme/locales/id.json":`{
  "accessibility": {
    "skip_to_content": "Langsung ke konten"
  },
  "general": {
    "close": "Tutup",
    "view_all": "Lihat semua",
    "meta": {
      "tags": "Tag \\"{{ tags }}\\"",
      "page": "Halaman {{ page }}"
    },
    "countdown": {
      "days": "Hari",
      "hours": "Jam",
      "minutes": "Menit",
      "seconds": "Detik"
    }
  },
  "header": {
    "menu": "Menu",
    "search": "Cari",
    "account": "Akun",
    "cart": "Tas",
    "primary_navigation": "Utama"
  },
  "newsletter": {
    "label": "Email",
    "placeholder": "Alamat email",
    "submit": "Kabari saya",
    "success": "Tercatat. Satu email saat drop berikutnya dibuka."
  },
  "localization": {
    "country": "Kirim ke",
    "update": "Perbarui"
  },
  "onboarding": {
    "product_title": "Nama produk"
  },
  "password": {
    "enter_store": "Masuk dengan kata sandi",
    "label": "Kata sandi",
    "enter": "Masuk",
    "notify": "Kabari saya",
    "admin_link_html": "Pemilik toko? <a href=\\"{{ link }}\\" class=\\"link\\">Masuk di sini</a>"
  },
  "products": {
    "product": {
      "add_to_cart": "Masukkan ke tas",
      "added": "Masuk ke tas",
      "sold_out": "Habis",
      "unavailable": "Tidak tersedia",
      "add_variant": "Masukkan {{ product }} ukuran {{ variant }} ke tas",
      "quick_add": "Tambah cepat",
      "quick_add_option": "Tambah \u2014 pilih {{ option }}",
      "color_count": {
        "one": "{{ count }} warna",
        "other": "{{ count }} warna"
      },
      "last_units": {
        "one": "Sisa {{ count }}",
        "other": "Sisa {{ count }}"
      },
      "from_price": "Mulai {{ price }}",
      "regular_price": "Harga normal",
      "sale_price": "Harga diskon",
      "tax_included": "Termasuk pajak",
      "gallery_label": "Foto produk",
      "size_guide": "Panduan ukuran",
      "size_guide_missing": "Ukuran untuk produk ini segera hadir. Kirim pesan dan kami ukurkan untuk Anda.",
      "fit": "Potongan",
      "description": "Deskripsi",
      "material_care": "Bahan & perawatan",
      "material": "Bahan",
      "origin": "Dibuat di",
      "care": "Perawatan",
      "pairs_with": "Cocok dengan"
    },
    "inventory": {
      "in_stock": "Tersedia \u2014 dikirim dalam 1\u20132 hari kerja",
      "low": {
        "one": "Tinggal {{ count }} di ukuran ini",
        "other": "Tinggal {{ count }} di ukuran ini"
      },
      "preorder": "Pre-order \u2014 dikirim setelah batch berikutnya selesai",
      "sold_out": "Habis untuk pilihan ini"
    },
    "back_in_stock": {
      "heading": "Kirim satu email jika {{ variant }} tersedia lagi",
      "submit": "Kabari saya"
    }
  },
  "cart": {
    "general": {
      "title": "Tas",
      "items": {
        "one": "{{ count }} barang",
        "other": "{{ count }} barang"
      },
      "empty": "Tas Anda masih kosong.",
      "continue": "Lihat drop",
      "checkout": "Checkout",
      "view_cart": "Lihat tas",
      "subtotal": "Subtotal",
      "note": "Catatan pesanan",
      "taxes_and_shipping": "Termasuk pajak. Ongkir dihitung saat checkout.",
      "remove": "Hapus",
      "decrease": "Kurangi jumlah {{ product }}",
      "increase": "Tambah jumlah {{ product }}",
      "quantity_for": "Jumlah {{ product }}",
      "error": "Terjadi kesalahan. Silakan coba lagi."
    },
    "shipping": {
      "remaining_html": "Kurang {{ amount }} lagi untuk gratis ongkir",
      "unlocked": "Gratis ongkir aktif",
      "progress_label": "Progres gratis ongkir"
    }
  },
  "collections": {
    "general": {
      "items_count": {
        "one": "{{ count }} barang",
        "other": "{{ count }} barang"
      },
      "count": {
        "one": "{{ count }} koleksi",
        "other": "{{ count }} koleksi"
      },
      "all": "Semua koleksi",
      "load_more": "Muat lagi",
      "no_matches": "Tidak ada yang cocok dengan filter ini.",
      "products": "Produk"
    },
    "filters": {
      "title": "Filter",
      "apply": "Terapkan",
      "clear_all": "Hapus semua",
      "remove": "Hapus filter",
      "show_results": "Lihat hasil",
      "from": "Dari",
      "to": "Sampai"
    },
    "sorting": {
      "title": "Urutkan"
    }
  },
  "search": {
    "title": "Cari",
    "label": "Cari di toko",
    "placeholder": "Cari",
    "submit": "Cari",
    "suggestions": "Saran",
    "products": "Produk",
    "collections": "Koleksi",
    "view_all": "Semua hasil untuk \u201C{{ terms }}\u201D",
    "results_count": {
      "one": "{{ count }} hasil untuk \u201C{{ terms }}\u201D",
      "other": "{{ count }} hasil untuk \u201C{{ terms }}\u201D"
    },
    "no_results": "Tidak ada hasil untuk \u201C{{ terms }}\u201D."
  },
  "sections": {
    "archive": {
      "available": "Tersedia",
      "sold_out": "Habis",
      "upcoming": "Segera"
    },
    "lookbook": {
      "count": {
        "one": "{{ count }} item",
        "other": "{{ count }} item"
      },
      "pin_label": "{{ number }} \u2014 {{ product }}"
    }
  },
  "blogs": {
    "article": {
      "count": {
        "one": "{{ count }} catatan",
        "other": "{{ count }} catatan"
      }
    }
  },
  "templates": {
    "404": {
      "title": "Tidak ada.",
      "subtext": "Halaman ini habis, pindah, atau memang tidak pernah ada. Drop yang sekarang masih dibuka."
    }
  }
}`,"/repo/theme/sections/announcement-bar.liquid":`{%- comment -%}
  Announcement bar with optional per-message countdown.
  A message whose countdown has expired swaps to its "after" text on the
  client, and on the server once the end time has passed, so the bar is
  correct even before JS runs.
{%- endcomment -%}
{%- liquid
  assign now = 'now' | date: '%s' | plus: 0
  assign visible_blocks = section.blocks | where: 'type', 'message'
-%}
{%- if visible_blocks.size > 0 -%}
  <rotating-bar class="bar t-label scheme-{{ section.settings.color_scheme }}" data-interval="{{ section.settings.interval | times: 1000 }}">
    {%- for block in visible_blocks -%}
      {%- liquid
        assign has_countdown = false
        assign expired = false
        if block.settings.countdown_to != blank
          assign has_countdown = true
          assign target = block.settings.countdown_to | date: '%s' | plus: 0
          if target <= now
            assign expired = true
          endif
        endif
      -%}
      <div class="bar__msg" data-index="{{ forloop.index0 }}" {% unless forloop.first %}hidden{% endunless %} {{ block.shopify_attributes }}>
        {%- if block.settings.link != blank %}<a href="{{ block.settings.link }}">{% endif -%}
        {%- if expired -%}
          <span>{{ block.settings.after_text | default: block.settings.text }}</span>
        {%- else -%}
          <span data-before>{{ block.settings.text }}</span>
          {%- if has_countdown -%}
            <span class="bar__sep" aria-hidden="true">/</span>
            <countdown-timer
              class="bar__time"
              data-target="{{ target }}"
              data-after="{{ block.settings.after_text | escape }}"
            >
              {{- block.settings.countdown_to | date: '%d.%m \xB7 %H:%M' -}}
            </countdown-timer>
          {%- endif -%}
        {%- endif -%}
        {%- if block.settings.link != blank %}</a>{% endif -%}
      </div>
    {%- endfor -%}
  </rotating-bar>
{%- endif -%}

{% schema %}
{
  "name": "Announcement bar",
  "class": "section-announcement",
  "enabled_on": { "groups": ["header"] },
  "max_blocks": 3,
  "settings": [
    {
      "type": "select",
      "id": "color_scheme",
      "label": "Color scheme",
      "options": [
        { "value": "ink", "label": "Ink" },
        { "value": "signal", "label": "Signal" },
        { "value": "paper", "label": "Paper" }
      ],
      "default": "ink"
    },
    {
      "type": "range",
      "id": "interval",
      "label": "Rotate every",
      "min": 3,
      "max": 10,
      "step": 1,
      "unit": "s",
      "default": 5
    }
  ],
  "blocks": [
    {
      "type": "message",
      "name": "Message",
      "settings": [
        { "type": "text", "id": "text", "label": "Text", "default": "Drop 07 \u2014 Kemarau opens" },
        { "type": "url", "id": "link", "label": "Link" },
        {
          "type": "text",
          "id": "countdown_to",
          "label": "Count down to",
          "info": "ISO date-time with offset, e.g. 2026-10-24T19:00:00+07:00. Leave empty for a plain message."
        },
        {
          "type": "text",
          "id": "after_text",
          "label": "Text after countdown ends",
          "default": "Drop 07 is live \u2014 shop now"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Announcement bar",
      "blocks": [{ "type": "message" }]
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/cart-drawer.liquid":`<dialog class="drawer" id="cart-drawer" aria-label="{{ 'cart.general.title' | t }}">
  <cart-items class="cart-drawer" data-cart-root="cart-drawer" data-count="{{ cart.item_count }}" style="display:contents">
    <div class="drawer__head">
      <span class="t-label">{{ 'cart.general.title' | t }} ({{ cart.item_count }})</span>
      <button type="button" class="t-label" data-close-dialog>{{ 'general.close' | t }}</button>
    </div>

    {%- if cart.item_count > 0 -%}
      {% render 'free-shipping-meter' %}
      <div class="drawer__body">
        {% render 'cart-lines' %}
        {%- if settings.cart_note -%}
          <details class="disclosure" style="padding: 16px var(--gutter)">
            <summary class="t-label">{{ 'cart.general.note' | t }}</summary>
            <textarea class="input" name="note" data-cart-note form="cart-drawer-form" style="margin-top:12px" aria-label="{{ 'cart.general.note' | t }}">{{ cart.note }}</textarea>
          </details>
        {%- endif -%}
      </div>
      <form class="drawer__foot" action="{{ routes.cart_url }}" method="post" id="cart-drawer-form">
        {%- for discount in cart.cart_level_discount_applications -%}
          <div class="cart-totals t-label t-signal">
            <span>{{ discount.title }}</span><span>&minus;{{ discount.total_allocated_amount | money }}</span>
          </div>
        {%- endfor -%}
        <div class="cart-totals">
          <span class="t-label">{{ 'cart.general.subtotal' | t }}</span>
          <span class="cart-totals__amount">{{ cart.total_price | money_with_currency }}</span>
        </div>
        <p class="t-label t-label--sm t-muted">{{ 'cart.general.taxes_and_shipping' | t }}</p>
        <button type="submit" name="checkout" class="btn btn--block">
          <span>{{ 'cart.general.checkout' | t }}</span>{% render 'icon', name: 'arrow' %}
        </button>
        <a href="{{ routes.cart_url }}" class="t-label link" style="justify-self:center">{{ 'cart.general.view_cart' | t }}</a>
      </form>
    {%- else -%}
      <div class="drawer__body">
        <div class="cart-empty">
          <p class="t-h1">{{ 'cart.general.empty' | t }}</p>
          <a href="{{ routes.all_products_collection_url }}" class="btn">
            <span>{{ 'cart.general.continue' | t }}</span>{% render 'icon', name: 'arrow' %}
          </a>
        </div>
      </div>
    {%- endif -%}
  </cart-items>
</dialog>

{% schema %}
{
  "name": "Cart drawer",
  "settings": []
}
{% endschema %}
`,"/repo/theme/sections/collection-index.liquid":`{%- comment -%}
  Drop archive rendered as an index table. Status is derived from inventory:
  a drop whose products are all unavailable reads "Sold out" without anyone
  having to remember to update it. The "Upcoming" override is for drops whose
  collection exists but is not on sale yet.
{%- endcomment -%}
<section class="archive section--flush" aria-labelledby="archive-title-{{ section.id }}">
  <div class="sec-head">
    <span class="t-label t-muted">{{ section.settings.index_label | escape }}</span>
    <h2 class="sec-head__title" id="archive-title-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
    <span></span>
  </div>

  <ol class="archive__list" role="list">
    {%- for block in section.blocks -%}
      {%- liquid
        assign c = block.settings.collection
        assign available_count = 0
        for p in c.products limit: 50
          if p.available
            assign available_count = available_count | plus: 1
          endif
        endfor
        if block.settings.upcoming
          assign status = 'sections.archive.upcoming' | t
          assign status_class = 'badge--signal'
        elsif c.products_count > 0 and available_count == 0
          assign status = 'sections.archive.sold_out' | t
          assign status_class = 'badge--ink'
        else
          assign status = 'sections.archive.available' | t
          assign status_class = ''
        endif
      -%}
      <li class="archive__row" {{ block.shopify_attributes }}>
        <a href="{{ c.url | default: '#' }}" class="archive__link">
          <span class="archive__no t-label t-muted">{{ block.settings.number | escape }}</span>
          <span class="archive__name">{{ c.title | default: block.settings.fallback_title | escape }}</span>
          <span class="archive__meta t-label t-muted hide-mobile">{{ block.settings.season | escape }}</span>
          <span class="archive__meta t-label t-muted hide-mobile">{{ 'collections.general.items_count' | t: count: c.products_count }}</span>
          <span class="badge t-label t-label--sm {{ status_class }}">{{ status }}</span>
          {%- if c.image -%}
            <span class="archive__peek media" aria-hidden="true">
              {{ c.image | image_url: width: 600 | image_tag: widths: '300, 450, 600', sizes: '280px', alt: '', loading: 'lazy' }}
            </span>
          {%- endif -%}
        </a>
      </li>
    {%- endfor -%}
  </ol>
</section>

<style>
  .archive__list { border-bottom: 1px solid var(--line); }
  .archive__row + .archive__row { border-top: 1px solid var(--line); }
  .archive__link {
    position: relative;
    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: 16px;
    align-items: center;
    padding: 18px var(--gutter);
    text-decoration: none;
    transition: background var(--dur) var(--ease), padding var(--dur) var(--ease);
  }
  .archive__name {
    font-size: var(--step-2);
    font-weight: 720;
    font-stretch: 112%;
    text-transform: uppercase;
    letter-spacing: -0.015em;
    line-height: 1;
  }
  .archive__peek {
    position: absolute;
    right: 22%;
    top: 50%;
    width: 220px;
    aspect-ratio: 4 / 5;
    translate: 0 -50%;
    opacity: 0;
    pointer-events: none;
    z-index: 2;
    transition: opacity var(--dur) var(--ease), translate 320ms var(--ease);
  }
  .archive__peek img { width: 100%; height: 100%; object-fit: cover; }
  @media (min-width: 990px) {
    .archive__link { grid-template-columns: 64px 1fr 220px 120px 110px; }
    .archive__link:hover { background: var(--ink); color: var(--paper); }
    .archive__link:hover .t-muted { color: rgba(var(--paper-rgb), 0.6); }
    .archive__link:hover .archive__peek { opacity: 1; translate: 0 -54%; }
  }
  @media (hover: none) { .archive__peek { display: none; } }
</style>

{% schema %}
{
  "name": "Drop archive",
  "tag": "div",
  "max_blocks": 12,
  "settings": [
    { "type": "text", "id": "index_label", "label": "Index label", "default": "04" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Archive" }
  ],
  "blocks": [
    {
      "type": "drop",
      "name": "Drop",
      "settings": [
        { "type": "collection", "id": "collection", "label": "Collection" },
        { "type": "text", "id": "number", "label": "Number", "default": "07" },
        { "type": "text", "id": "fallback_title", "label": "Title (if no collection)", "default": "Kemarau" },
        { "type": "text", "id": "season", "label": "Season", "default": "Dry season 2026" },
        { "type": "checkbox", "id": "upcoming", "label": "Mark as upcoming", "default": false }
      ]
    }
  ],
  "presets": [
    {
      "name": "Drop archive",
      "blocks": [
        { "type": "drop", "settings": { "number": "07", "fallback_title": "Kemarau", "season": "Dry season 2026", "upcoming": true } },
        { "type": "drop", "settings": { "number": "06", "fallback_title": "Pancaroba", "season": "Transition 2026" } },
        { "type": "drop", "settings": { "number": "05", "fallback_title": "Hujan", "season": "Wet season 2025" } }
      ]
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/featured-collection.liquid":`{%- liquid
  assign collection = section.settings.collection
  assign columns = section.settings.columns
  assign limit = section.settings.limit
-%}
<section class="featured section--flush" aria-labelledby="fc-title-{{ section.id }}">
  <div class="sec-head">
    <span class="t-label t-muted">{{ section.settings.index_label | escape }}</span>
    <h2 class="sec-head__title" id="fc-title-{{ section.id }}">
      {{- section.settings.heading | default: collection.title | escape -}}
      {%- if collection != blank -%}
        <span class="t-label t-muted" style="margin-left:10px">{{ 'collections.general.items_count' | t: count: collection.products_count }}</span>
      {%- endif -%}
    </h2>
    {%- if section.settings.show_view_all and collection != blank -%}
      <a href="{{ collection.url }}" class="t-label link-arrow">{{ 'general.view_all' | t }} {% render 'icon', name: 'arrow' %}</a>
    {%- else -%}
      <span></span>
    {%- endif -%}
  </div>

  <ul role="list" class="grid grid--{{ columns }}" style="--cols-desktop: {{ columns }}">
    {%- if collection != blank and collection.products_count > 0 -%}
      {%- for product in collection.products limit: limit -%}
        <li>{% render 'product-card', product: product, columns: columns %}</li>
      {%- endfor -%}
    {%- else -%}
      {%- for i in (1..limit) -%}
        <li>
          <article class="card">
            {%- assign ph = i | modulo: 4 | plus: 1 -%}
            <div class="card__media">{{ 'apparel-' | append: ph | placeholder_svg_tag: 'placeholder-svg' }}</div>
            <div class="card__info">
              <span class="card__index t-label t-label--sm t-muted">07.{{ i | prepend: '0' | slice: -2, 2 }}</span>
              <h3 class="card__title">{{ 'onboarding.product_title' | t }}</h3>
              <span class="card__price">{{ 1990000 | money }}</span>
            </div>
          </article>
        </li>
      {%- endfor -%}
    {%- endif -%}
  </ul>
</section>

{% schema %}
{
  "name": "Featured collection",
  "tag": "div",
  "settings": [
    { "type": "collection", "id": "collection", "label": "Collection" },
    { "type": "text", "id": "index_label", "label": "Index label", "default": "01" },
    { "type": "text", "id": "heading", "label": "Heading", "info": "Defaults to the collection title." },
    {
      "type": "range",
      "id": "limit",
      "label": "Products to show",
      "min": 2,
      "max": 16,
      "step": 1,
      "default": 8
    },
    {
      "type": "select",
      "id": "columns",
      "label": "Columns (desktop)",
      "options": [
        { "value": "3", "label": "3" },
        { "value": "4", "label": "4" },
        { "value": "5", "label": "5" }
      ],
      "default": "4"
    },
    { "type": "checkbox", "id": "show_view_all", "label": "Show \u201CView all\u201D link", "default": true }
  ],
  "presets": [{ "name": "Featured collection" }]
}
{% endschema %}
`,"/repo/theme/sections/footer-group.json":`{
  "type": "footer",
  "name": "Footer group",
  "sections": {
    "footer": {
      "type": "footer",
      "blocks": {
        "signup": { "type": "signup", "settings": {} },
        "menu-shop": { "type": "menu", "settings": { "heading": "Shop", "menu": "main-menu" } },
        "menu-help": { "type": "menu", "settings": { "heading": "Help", "menu": "footer" } },
        "studio": { "type": "text", "settings": {} }
      },
      "block_order": ["signup", "menu-shop", "menu-help", "studio"],
      "settings": { "color_scheme": "ink", "show_wordmark": true }
    }
  },
  "order": ["footer"]
}
`,"/repo/theme/sections/footer.liquid":`<footer class="site-footer scheme-{{ section.settings.color_scheme }}">
  <div class="site-footer__cols">
    {%- for block in section.blocks -%}
      {%- case block.type -%}
        {%- when 'signup' -%}
          <div class="site-footer__signup" {{ block.shopify_attributes }}>
            <p class="t-h2">{{ block.settings.heading | escape }}</p>
            {%- if block.settings.text != blank -%}
              <p class="t-muted" style="margin-top:8px">{{ block.settings.text | escape }}</p>
            {%- endif -%}
            <div style="margin-top:20px">
            {%- form 'customer', id: 'footer-signup' -%}
              <input type="hidden" name="contact[tags]" value="newsletter,drop-alert,source:footer">
              {%- if form.posted_successfully? -%}
                <p class="t-label" role="status">{{ 'newsletter.success' | t }}</p>
              {%- else -%}
                <div class="inline-form">
                  <label for="footer-email" class="visually-hidden">{{ 'newsletter.label' | t }}</label>
                  <input id="footer-email" class="input" type="email" name="contact[email]" required autocomplete="email" placeholder="{{ 'newsletter.placeholder' | t }}">
                  <button class="btn" type="submit"><span>{{ 'newsletter.submit' | t }}</span></button>
                </div>
                {%- if form.errors -%}
                  <p class="form-message form-message--error" role="alert">{{ form.errors.translated_fields.email | capitalize }} {{ form.errors.messages.email }}</p>
                {%- endif -%}
              {%- endif -%}
            {%- endform -%}
            </div>
          </div>
        {%- when 'menu' -%}
          <nav {{ block.shopify_attributes }} aria-label="{{ block.settings.heading | escape }}">
            <p class="t-label t-muted">{{ block.settings.heading | escape }}</p>
            <ul role="list">
              {%- for link in block.settings.menu.links -%}
                <li><a href="{{ link.url }}">{{ link.title | escape }}</a></li>
              {%- endfor -%}
            </ul>
          </nav>
        {%- when 'text' -%}
          <div {{ block.shopify_attributes }}>
            <p class="t-label t-muted">{{ block.settings.heading | escape }}</p>
            <div class="rte" style="margin-top:14px">{{ block.settings.text }}</div>
          </div>
      {%- endcase -%}
    {%- endfor -%}
  </div>

  {%- if section.settings.show_wordmark -%}
    <p class="site-footer__mark" aria-hidden="true">{{ settings.wordmark | default: shop.name }}</p>
  {%- endif -%}

  <div class="site-footer__base t-label t-label--sm">
    <span>&copy; {{ 'now' | date: '%Y' }} {{ shop.name }}. {{ section.settings.base_text | escape }}</span>

    {%- if localization.available_countries.size > 1 -%}
      {%- form 'localization', class: 'localization', id: 'footer-localization' -%}
        <label for="footer-country" class="t-muted">{{ 'localization.country' | t }}</label>
        <select id="footer-country" name="country_code" class="select t-label t-label--sm">
          {%- for country in localization.available_countries -%}
            <option value="{{ country.iso_code }}" {% if country.iso_code == localization.country.iso_code %}selected{% endif %}>
              {{ country.name }} ({{ country.currency.iso_code }})
            </option>
          {%- endfor -%}
        </select>
        <noscript><button class="t-label">{{ 'localization.update' | t }}</button></noscript>
      {%- endform -%}
    {%- endif -%}

    {%- if settings.social_instagram != blank or settings.social_tiktok != blank -%}
      <span style="display:flex;gap:16px">
        {%- if settings.social_instagram != blank -%}<a href="{{ settings.social_instagram }}" class="link" rel="noopener" target="_blank">Instagram</a>{%- endif -%}
        {%- if settings.social_tiktok != blank -%}<a href="{{ settings.social_tiktok }}" class="link" rel="noopener" target="_blank">TikTok</a>{%- endif -%}
      </span>
    {%- endif -%}
  </div>
</footer>

{% schema %}
{
  "name": "Footer",
  "class": "section-footer",
  "enabled_on": { "groups": ["footer"] },
  "settings": [
    {
      "type": "select",
      "id": "color_scheme",
      "label": "Color scheme",
      "options": [
        { "value": "paper", "label": "Paper" },
        { "value": "ink", "label": "Ink" }
      ],
      "default": "ink"
    },
    { "type": "checkbox", "id": "show_wordmark", "label": "Show oversized wordmark", "default": true },
    { "type": "text", "id": "base_text", "label": "Base line text", "default": "Cut and sewn in Bandung." }
  ],
  "blocks": [
    {
      "type": "signup",
      "name": "Drop alerts signup",
      "limit": 1,
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Hear about the next drop first." },
        { "type": "text", "id": "text", "label": "Text", "default": "One email per drop. No discounts-of-the-week." }
      ]
    },
    {
      "type": "menu",
      "name": "Menu",
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Shop" },
        { "type": "link_list", "id": "menu", "label": "Menu", "default": "footer" }
      ]
    },
    {
      "type": "text",
      "name": "Text",
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Studio" },
        { "type": "richtext", "id": "text", "label": "Text", "default": "<p>Jl. Braga 21, Bandung<br>Open Thu\u2013Sun, 11\u201319</p>" }
      ]
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/header-group.json":`{
  "type": "header",
  "name": "Header group",
  "sections": {
    "announcement": {
      "type": "announcement-bar",
      "blocks": {
        "msg-1": {
          "type": "message",
          "settings": {
            "text": "Drop 07 \u2014 Kemarau opens",
            "link": "shopify://collections/all",
            "countdown_to": "2026-10-24T19:00:00+07:00",
            "after_text": "Drop 07 is live \u2014 140 pieces, no restock"
          }
        },
        "msg-2": {
          "type": "message",
          "settings": {
            "text": "Free shipping in Indonesia over Rp 750.000",
            "countdown_to": "",
            "after_text": ""
          }
        }
      },
      "block_order": ["msg-1", "msg-2"],
      "settings": { "color_scheme": "ink", "interval": 5 }
    },
    "header": {
      "type": "header",
      "settings": { "menu": "main-menu", "search_limit": 6 }
    }
  },
  "order": ["announcement", "header"]
}
`,"/repo/theme/sections/header.liquid":`{%- liquid
  assign menu = section.settings.menu
-%}
<header class="site-header" data-header>
  <div class="site-header__inner">
    <button
      type="button"
      class="site-header__menu-btn t-label"
      data-open-dialog="menu-drawer"
      aria-haspopup="dialog"
    >
      {{- 'header.menu' | t -}}
    </button>

    <nav class="site-nav" aria-label="{{ 'header.primary_navigation' | t }}">
      {%- for link in menu.links -%}
        <a class="t-label" href="{{ link.url }}" {% if link.current %}aria-current="page"{% endif %}>
          {{- link.title | escape -}}
        </a>
      {%- endfor -%}
    </nav>

    <a href="{{ routes.root_url }}" class="site-header__logo" aria-label="{{ shop.name | escape }}">
      {%- if settings.logo -%}
        {{ settings.logo | image_url: width: 480 | image_tag: widths: '120, 240, 480', sizes: 'var(--logo-width)', alt: shop.name, loading: 'eager' }}
      {%- else -%}
        {{- settings.wordmark | default: shop.name | escape -}}
      {%- endif -%}
    </a>

    <div class="site-header__actions">
      <a
        href="{{ routes.search_url }}"
        class="t-label"
        data-open-dialog="search-sheet"
        aria-haspopup="dialog"
      >
        <span class="hide-mobile" aria-hidden="true">{{ 'header.search' | t }}</span>
        <span class="visually-hidden">{{ 'header.search' | t }}</span>
        <span aria-hidden="true" style="display:inline-flex" class="show-mobile-inline">{% render 'icon', name: 'search' %}</span>
      </a>
      {%- if shop.customer_accounts_enabled -%}
        <a href="{{ routes.account_url }}" class="t-label hide-mobile">{{ 'header.account' | t }}</a>
      {%- endif -%}
      <a
        href="{{ routes.cart_url }}"
        class="t-label"
        {% if settings.cart_type == 'drawer' %}
          data-open-dialog="cart-drawer" aria-haspopup="dialog"
        {% endif %}
      >
        {{- 'header.cart' | t -}}
        (<span class="cart-count" data-cart-count>{{ cart.item_count }}</span>)
      </a>
    </div>
  </div>
</header>

{%- comment -%} Mobile navigation {%- endcomment -%}
<dialog class="drawer drawer--left menu-drawer" id="menu-drawer" aria-label="{{ 'header.menu' | t }}">
  <div class="drawer__head">
    <span class="t-label">{{ 'header.menu' | t }}</span>
    <button type="button" class="t-label" data-close-dialog>{{ 'general.close' | t }}</button>
  </div>
  <div class="drawer__body">
    <nav class="menu-drawer__list">
      {%- for link in menu.links -%}
        <a href="{{ link.url }}" {% if link.current %}aria-current="page"{% endif %}>
          <span>{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
          <span>{{ link.title | escape }}</span>
        </a>
      {%- endfor -%}
    </nav>
  </div>
  <div class="drawer__foot">
    {%- if shop.customer_accounts_enabled -%}
      <a href="{{ routes.account_url }}" class="btn btn--outline btn--block">
        <span>{{ 'header.account' | t }}</span>{% render 'icon', name: 'arrow' %}
      </a>
    {%- endif -%}
  </div>
</dialog>

{%- comment -%} Search sheet: predictive results are fetched as a section. {%- endcomment -%}
<dialog class="search-sheet" id="search-sheet" aria-label="{{ 'header.search' | t }}">
  <predictive-search class="search-sheet__inner" data-limit="{{ section.settings.search_limit }}">
    <form action="{{ routes.search_url }}" method="get" role="search" class="search-sheet__form">
      <label for="search-sheet-input" class="visually-hidden">{{ 'search.label' | t }}</label>
      <input
        id="search-sheet-input"
        class="search-sheet__input"
        type="search"
        name="q"
        placeholder="{{ 'search.placeholder' | t }}"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        aria-controls="predictive-search-results"
        aria-autocomplete="list"
      >
      <input type="hidden" name="options[prefix]" value="last">
      <button type="button" class="t-label" data-close-dialog>{{ 'general.close' | t }}</button>
    </form>
    <div id="predictive-search-results" class="search-sheet__results" aria-live="polite"></div>
  </predictive-search>
</dialog>

<style>
  .search-sheet {
    width: 100vw;
    max-width: none;
    margin: 0;
    padding: 0;
    border: 0;
    border-bottom: 1px solid var(--ink);
    background: var(--paper);
    color: var(--ink);
    max-height: 85dvh;
  }
  .search-sheet::backdrop { background: rgba(var(--ink-rgb), 0.38); }
  .search-sheet__form {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 0 var(--gutter);
    border-bottom: 1px solid var(--rule);
  }
  .search-sheet__input {
    height: 88px;
    border: 0;
    background: transparent;
    font-size: var(--step-3);
    font-weight: 760;
    font-stretch: 115%;
    letter-spacing: -0.025em;
    text-transform: uppercase;
    min-width: 0;
  }
  .search-sheet__input:focus { outline: none; }
  .search-sheet__input::placeholder { color: var(--rule); }
  .search-sheet__input::-webkit-search-cancel-button { display: none; }
  .search-sheet__results { overflow-y: auto; max-height: calc(85dvh - 89px); }
  .show-mobile-inline { display: inline-flex; }
  @media (min-width: 990px) { .show-mobile-inline { display: none !important; } }
</style>

{% schema %}
{
  "name": "Header",
  "class": "section-header",
  "enabled_on": { "groups": ["header"] },
  "settings": [
    { "type": "link_list", "id": "menu", "label": "Menu", "default": "main-menu" },
    {
      "type": "range",
      "id": "search_limit",
      "label": "Predictive search results",
      "min": 3,
      "max": 10,
      "step": 1,
      "default": 6
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/hero-drop.liquid":`{%- comment -%}
  Campaign hero for a drop. The image is the LCP element on most pages, so
  when this section is first on the page it loads eagerly with
  fetchpriority=high and a preload header; otherwise it lazy-loads.
{%- endcomment -%}
{%- liquid
  assign is_first = false
  if section.index == 1
    assign is_first = true
  endif

  assign now = 'now' | date: '%s' | plus: 0
  assign countdown_active = false
  if section.settings.countdown_to != blank
    assign target = section.settings.countdown_to | date: '%s' | plus: 0
    if target > now
      assign countdown_active = true
    endif
  endif
-%}

<section class="hero scheme-{{ section.settings.color_scheme }} hero--img-{{ section.settings.image_position }}" aria-labelledby="hero-title-{{ section.id }}">
  <div class="hero__media media"{% if section.settings.image %} style="--hero-ratio: {{ section.settings.image.aspect_ratio }}"{% endif %}>
    {%- if section.settings.image -%}
      {%- if is_first -%}
        {% render 'image', image: section.settings.image, sizes: '(min-width: 990px) 58vw, 100vw', eager: true %}
      {%- else -%}
        {% render 'image', image: section.settings.image, sizes: '(min-width: 990px) 58vw, 100vw' %}
      {%- endif -%}
    {%- else -%}
      {{ 'lifestyle-2' | placeholder_svg_tag: 'placeholder-svg' }}
    {%- endif -%}
    {%- if section.settings.image_caption != blank -%}
      <p class="hero__caption t-label t-label--sm">{{ section.settings.image_caption | escape }}</p>
    {%- endif -%}
  </div>

  <div class="hero__copy">
    <p class="hero__eyebrow t-label">
      <span>{{ section.settings.eyebrow | escape }}</span>
      <span class="t-muted">{{ section.settings.eyebrow_right | escape }}</span>
    </p>

    {%- if is_first -%}
      <h1 class="hero__title t-display" id="hero-title-{{ section.id }}">{{ section.settings.title | escape | newline_to_br }}</h1>
    {%- else -%}
      <h2 class="hero__title t-display" id="hero-title-{{ section.id }}">{{ section.settings.title | escape | newline_to_br }}</h2>
    {%- endif -%}

    <div class="hero__foot">
      {%- if section.settings.text != blank -%}
        <p class="hero__text t-body-lg">{{ section.settings.text | escape }}</p>
      {%- endif -%}

      {%- if section.blocks.size > 0 -%}
        <dl class="spec">
          {%- for block in section.blocks -%}
            <div class="spec__row" {{ block.shopify_attributes }}>
              <dt class="t-label t-muted">{{ block.settings.label | escape }}</dt>
              <dd>{{ block.settings.value | escape }}</dd>
            </div>
          {%- endfor -%}
        </dl>
      {%- endif -%}

      {%- if countdown_active -%}
        <div class="hero__countdown">
          <p class="t-label t-muted">{{ section.settings.countdown_label | escape }}</p>
          <countdown-timer class="countdown" data-target="{{ target }}" data-format="blocks" data-after="{{ section.settings.countdown_after | escape }}">
            <span class="countdown__fallback t-h1">{{ section.settings.countdown_to | date: '%d.%m.%Y \xB7 %H:%M' }}</span>
          </countdown-timer>
        </div>
      {%- endif -%}

      {%- if section.settings.button_label != blank -%}
        <a href="{{ section.settings.button_link | default: routes.all_products_collection_url }}" class="btn hero__cta">
          <span>{{ section.settings.button_label | escape }}</span>{% render 'icon', name: 'arrow' %}
        </a>
      {%- endif -%}
    </div>
  </div>
</section>

<style>
  .hero {
    display: grid;
    border-bottom: 1px solid var(--line);
  }
  /* Mobile: the image's own ratio, so annotated artwork is never cropped. */
  .hero__media { aspect-ratio: var(--hero-ratio, 4 / 5); position: relative; }
  .hero__media img, .hero__media svg { position: absolute; inset: 0; }
  .hero__caption {
    position: absolute;
    left: var(--gutter);
    bottom: 14px;
    background: var(--paper);
    color: var(--ink);
    padding: 5px 7px 4px;
  }
  .hero__copy {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 20px var(--gutter) 32px;
  }
  .hero__eyebrow { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
  .hero__title { overflow-wrap: normal; }
  .hero__foot { display: grid; gap: 24px; margin-top: auto; }
  .hero__text { max-width: 38ch; }
  .hero__cta { justify-self: stretch; }


  .countdown { display: flex; gap: clamp(10px, 2vw, 20px); margin-top: 8px; }
  .countdown__unit { display: grid; gap: 4px; }
  .countdown__num {
    font-size: var(--step-3);
    font-weight: 760;
    font-stretch: 110%;
    line-height: 0.9;
    color: var(--signal);
    font-variant-numeric: tabular-nums;
    min-width: 2ch;
  }

  @media (min-width: 990px) {
    .hero {
      grid-template-columns: 7fr 5fr;
      min-height: calc(100svh - var(--header-h) - var(--bar-h));
    }
    .hero__media { aspect-ratio: auto; height: 100%; min-height: 560px; border-right: 1px solid var(--line); }
    .hero--img-right .hero__media { order: 2; border-right: 0; border-left: 1px solid var(--line); }
    .hero__copy { padding-block: 20px 32px; }
    .hero__cta { justify-self: start; min-width: 280px; }
    /* Sized to the copy column (5/12 of the viewport) so the longest word fits. */
    .hero__title { font-size: clamp(3rem, 5.8vw, 8rem); }
  }
</style>

{% schema %}
{
  "name": "Drop hero",
  "tag": "div",
  "class": "section-hero",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Image" },
    { "type": "text", "id": "image_caption", "label": "Image caption" },
    {
      "type": "select",
      "id": "image_position",
      "label": "Image position (desktop)",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "right", "label": "Right" }
      ],
      "default": "left"
    },
    {
      "type": "select",
      "id": "color_scheme",
      "label": "Color scheme",
      "options": [
        { "value": "paper", "label": "Paper" },
        { "value": "ink", "label": "Ink" },
        { "value": "signal", "label": "Signal" }
      ],
      "default": "paper"
    },
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Drop 07" },
    { "type": "text", "id": "eyebrow_right", "label": "Eyebrow (right)", "default": "Musim kemarau / 2026" },
    { "type": "textarea", "id": "title", "label": "Title", "default": "Dry\\nSeason\\nUniform" },
    {
      "type": "textarea",
      "id": "text",
      "label": "Text",
      "default": "Twelve pieces in undyed ramie and washed cotton drill, cut for 34\xB0 afternoons. Made once, in a run of 140."
    },
    { "type": "header", "content": "Countdown" },
    {
      "type": "text",
      "id": "countdown_to",
      "label": "Count down to",
      "info": "ISO date-time with offset, e.g. 2026-10-24T19:00:00+07:00. Hidden automatically once passed."
    },
    { "type": "text", "id": "countdown_label", "label": "Countdown label", "default": "Opens in" },
    { "type": "text", "id": "countdown_after", "label": "Text when countdown ends", "default": "Open now" },
    { "type": "header", "content": "Button" },
    { "type": "text", "id": "button_label", "label": "Label", "default": "View the drop" },
    { "type": "url", "id": "button_link", "label": "Link" }
  ],
  "blocks": [
    {
      "type": "spec",
      "name": "Spec row",
      "settings": [
        { "type": "text", "id": "label", "label": "Label", "default": "Pieces" },
        { "type": "text", "id": "value", "label": "Value", "default": "140, numbered" }
      ]
    }
  ],
  "max_blocks": 5,
  "presets": [
    {
      "name": "Drop hero",
      "blocks": [
        { "type": "spec", "settings": { "label": "Release", "value": "Fri 24.10 \u2014 19:00 WIB" } },
        { "type": "spec", "settings": { "label": "Pieces", "value": "140, numbered" } },
        { "type": "spec", "settings": { "label": "Cloth", "value": "Ramie linen, Majalaya" } }
      ]
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/lookbook.liquid":`{%- comment -%}
  Shoppable image. Each hotspot block pins a product to a point on the image
  and has a matching row in the list, so the products are reachable without
  hunting for markers (and by keyboard / screen reader in a sensible order).
{%- endcomment -%}
<section class="look section--flush" aria-labelledby="look-title-{{ section.id }}">
  <div class="sec-head">
    <span class="t-label t-muted">{{ section.settings.index_label | escape }}</span>
    <h2 class="sec-head__title" id="look-title-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
    <span class="t-label t-muted hide-mobile">{{ 'sections.lookbook.count' | t: count: section.blocks.size }}</span>
  </div>

  <look-book class="look__grid">
    <div class="look__media media"{% if section.settings.image %} style="--look-ratio: {{ section.settings.image.aspect_ratio }}"{% endif %}>
      {%- if section.settings.image -%}
        {% render 'image', image: section.settings.image, sizes: '(min-width: 990px) 66vw, 100vw' %}
      {%- else -%}
        {{ 'lifestyle-1' | placeholder_svg_tag: 'placeholder-svg' }}
      {%- endif -%}
      {%- for block in section.blocks -%}
        {%- assign pin_number = forloop.index | prepend: '0' | slice: -2, 2 -%}
        <button
          type="button"
          class="look__pin t-label t-label--sm"
          style="left: {{ block.settings.x }}%; top: {{ block.settings.y }}%"
          data-pin="{{ forloop.index }}"
          aria-label="{{ 'sections.lookbook.pin_label' | t: number: pin_number, product: block.settings.product.title | escape }}"
          {{ block.shopify_attributes }}
        >
          {{- pin_number -}}
        </button>
      {%- endfor -%}
    </div>

    <ol class="look__list" role="list">
      {%- for block in section.blocks -%}
        {%- assign p = block.settings.product -%}
        <li class="look__item" data-item="{{ forloop.index }}">
          <span class="t-label t-muted">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
          <div class="look__thumb media">
            {%- if p.featured_image -%}
              {{ p.featured_image | image_url: width: 240 | image_tag: widths: '80, 160, 240', sizes: '80px', alt: '', loading: 'lazy' }}
            {%- endif -%}
          </div>
          <div>
            {%- if p != blank -%}
              <a href="{{ p.url }}" class="look__name">{{ p.title | escape }}</a>
              <p class="t-label t-label--sm t-muted" style="margin-top:4px">{{ block.settings.note | escape }}</p>
            {%- else -%}
              <span class="look__name">{{ 'onboarding.product_title' | t }}</span>
            {%- endif -%}
          </div>
          <span class="look__price">
            {%- if p != blank -%}{% render 'price', product: p %}{%- endif -%}
          </span>
        </li>
      {%- endfor -%}
      {%- if section.settings.button_link != blank -%}
        <li class="look__cta">
          <a href="{{ section.settings.button_link }}" class="btn btn--outline btn--block">
            <span>{{ section.settings.button_label | escape }}</span>{% render 'icon', name: 'arrow' %}
          </a>
        </li>
      {%- endif -%}
    </ol>
  </look-book>
</section>

<style>
  .look__grid { display: grid; border-bottom: 1px solid var(--line); }
  /* The box takes the image's own ratio so hotspot percentages stay exact at every width. */
  .look__media { position: relative; aspect-ratio: var(--look-ratio, 4 / 3); }
  .look__media > img, .look__media > svg { position: absolute; inset: 0; }
  .look__pin {
    position: absolute;
    translate: -50% -50%;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    background: var(--paper);
    color: var(--ink);
    border: 1px solid var(--ink);
    transition: background var(--dur) var(--ease), color var(--dur) var(--ease), scale var(--dur) var(--ease);
  }
  .look__pin::after {
    content: '';
    position: absolute;
    inset: -7px;
    border: 1px solid var(--paper);
    opacity: 0.7;
  }
  .look__pin[data-active], .look__pin:hover { background: var(--signal); scale: 1.08; }
  .look__list { display: grid; align-content: start; }
  .look__item {
    display: grid;
    grid-template-columns: 28px 64px 1fr auto;
    gap: 14px;
    align-items: center;
    padding: 14px var(--gutter);
    border-bottom: 1px solid var(--line);
    transition: background var(--dur) var(--ease);
  }
  .look__item[data-active] { background: rgba(var(--ink-rgb), 0.05); }
  .look__item[data-active] > .t-label:first-child { color: var(--signal); }
  .look__thumb { aspect-ratio: 4 / 5; }
  .look__thumb img { width: 100%; height: 100%; object-fit: cover; }
  .look__name { font-weight: 550; text-decoration: none; }
  .look__name::after { content: ''; position: absolute; inset: 0; }
  .look__item { position: relative; }
  .look__cta { padding: 20px var(--gutter); }

  @media (min-width: 990px) {
    .look__grid { grid-template-columns: 2fr 1fr; }
    .look__media { border-right: 1px solid var(--line); }
    .look__list { position: sticky; top: var(--header-h); }
  }
</style>

{% schema %}
{
  "name": "Lookbook",
  "tag": "div",
  "max_blocks": 8,
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Image" },
    { "type": "text", "id": "index_label", "label": "Index label", "default": "02" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Worn: Pasar Cihapit, 07:40" },
    { "type": "text", "id": "button_label", "label": "Button label", "default": "Shop the look" },
    { "type": "url", "id": "button_link", "label": "Button link" }
  ],
  "blocks": [
    {
      "type": "hotspot",
      "name": "Hotspot",
      "settings": [
        { "type": "product", "id": "product", "label": "Product" },
        { "type": "text", "id": "note", "label": "Note", "default": "Wearing size M" },
        { "type": "range", "id": "x", "label": "Horizontal position", "min": 0, "max": 100, "step": 1, "unit": "%", "default": 50 },
        { "type": "range", "id": "y", "label": "Vertical position", "min": 0, "max": 100, "step": 1, "unit": "%", "default": 50 }
      ]
    }
  ],
  "presets": [
    {
      "name": "Lookbook",
      "blocks": [
        { "type": "hotspot", "settings": { "x": 46, "y": 34 } },
        { "type": "hotspot", "settings": { "x": 52, "y": 66 } },
        { "type": "hotspot", "settings": { "x": 30, "y": 82 } }
      ]
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/main-404.liquid":`<section class="section wrap" style="display:grid;gap:24px;justify-items:start">
  <p class="t-label t-muted">404</p>
  <h1 class="t-display">{{ 'templates.404.title' | t }}</h1>
  <p class="t-body-lg" style="max-width:40ch">{{ 'templates.404.subtext' | t }}</p>
  <a href="{{ routes.all_products_collection_url }}" class="btn"><span>{{ 'cart.general.continue' | t }}</span>{% render 'icon', name: 'arrow' %}</a>
</section>

{% schema %}
{ "name": "404", "tag": "section", "settings": [] }
{% endschema %}
`,"/repo/theme/sections/main-article.liquid":`<article class="section">
  <header class="wrap--narrow" style="display:grid;gap:16px">
    <time class="t-label t-muted" datetime="{{ article.published_at | date: '%Y-%m-%d' }}">{{ article.published_at | date: '%d.%m.%Y' }} \xB7 {{ article.author }}</time>
    <h1 class="t-h1">{{ article.title | escape }}</h1>
  </header>
  {%- if article.image -%}
    <div class="media" style="margin-block:40px;aspect-ratio:16/9">
      {% render 'image', image: article.image, sizes: '100vw', eager: true %}
    </div>
  {%- endif -%}
  <div class="wrap--narrow rte t-body-lg" style="margin-top:32px">{{ article.content }}</div>
  <div class="wrap--narrow" style="margin-top:48px">
    <a href="{{ blog.url }}" class="t-label link-arrow">{% render 'icon', name: 'arrow-left' %} {{ blog.title | escape }}</a>
  </div>
</article>

{% schema %}
{ "name": "Article", "tag": "section", "settings": [] }
{% endschema %}
`,"/repo/theme/sections/main-blog.liquid":`{%- paginate blog.articles by 12 -%}
  <div class="coll-head">
    <div class="coll-head__text">
      <p class="t-label t-muted">{{ 'blogs.article.count' | t: count: blog.articles_count }}</p>
      <h1 class="t-h1">{{ blog.title | escape }}</h1>
    </div>
  </div>
  <ol role="list" class="journal rule-top">
    {%- for article in blog.articles -%}
      <li class="journal__row">
        <a href="{{ article.url }}" class="journal__link">
          <time class="t-label t-muted" datetime="{{ article.published_at | date: '%Y-%m-%d' }}">{{ article.published_at | date: '%d.%m.%Y' }}</time>
          <span class="journal__title">{{ article.title | escape }}</span>
          <span class="journal__excerpt t-muted">{{ article.excerpt_or_content | strip_html | truncatewords: 24 }}</span>
        </a>
      </li>
    {%- endfor -%}
  </ol>
  {%- if paginate.pages > 1 -%}{{ paginate | default_pagination: next: '\u2192', previous: '\u2190' }}{%- endif -%}
{%- endpaginate -%}
<style>
  .journal__row { border-bottom: 1px solid var(--rule); }
  .journal__link { display: grid; gap: 8px; padding: 24px var(--gutter); text-decoration: none; }
  .journal__title { font-size: var(--step-2); font-weight: 680; font-stretch: 108%; line-height: 1.1; }
  .journal__link:hover .journal__title { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1px; }
  @media (min-width: 990px) {
    .journal__link { grid-template-columns: 160px 1fr 1fr; gap: var(--gutter); align-items: baseline; }
  }
</style>

{% schema %}
{ "name": "Blog", "tag": "section", "settings": [] }
{% endschema %}
`,"/repo/theme/sections/main-cart.liquid":`<div class="cart-page">
  <cart-items data-cart-root="{{ section.id }}" data-count="{{ cart.item_count }}" style="display:contents">
    <div class="coll-head">
      <div class="coll-head__text">
        <p class="t-label t-muted">{{ 'cart.general.items' | t: count: cart.item_count }}</p>
        <h1 class="t-h1">{{ 'cart.general.title' | t }}</h1>
      </div>
    </div>

    {%- if cart.item_count > 0 -%}
      <div class="cart-page__grid">
        <div class="cart-page__lines rule-top">
          {% render 'cart-lines' %}
        </div>
        <form action="{{ routes.cart_url }}" method="post" class="cart-page__summary" id="cart-form">
          {% render 'free-shipping-meter' %}
          <div class="cart-page__summary-inner">
            {%- if settings.cart_note -%}
              <div class="field">
                <label for="cart-note" class="t-label t-muted">{{ 'cart.general.note' | t }}</label>
                <textarea class="input" id="cart-note" name="note" data-cart-note>{{ cart.note }}</textarea>
              </div>
            {%- endif -%}
            {%- for discount in cart.cart_level_discount_applications -%}
              <div class="cart-totals t-label t-signal"><span>{{ discount.title }}</span><span>&minus;{{ discount.total_allocated_amount | money }}</span></div>
            {%- endfor -%}
            <div class="cart-totals">
              <span class="t-label">{{ 'cart.general.subtotal' | t }}</span>
              <span class="cart-totals__amount">{{ cart.total_price | money_with_currency }}</span>
            </div>
            <p class="t-label t-label--sm t-muted">{{ 'cart.general.taxes_and_shipping' | t }}</p>
            <button type="submit" name="checkout" class="btn btn--block">
              <span>{{ 'cart.general.checkout' | t }}</span>{% render 'icon', name: 'arrow' %}
            </button>
            {%- if additional_checkout_buttons -%}
              <div class="cart-page__dynamic">{{ content_for_additional_checkout_buttons }}</div>
            {%- endif -%}
          </div>
        </form>
      </div>
    {%- else -%}
      <div class="cart-empty rule-top">
        <p class="t-h2">{{ 'cart.general.empty' | t }}</p>
        <a href="{{ routes.all_products_collection_url }}" class="btn"><span>{{ 'cart.general.continue' | t }}</span>{% render 'icon', name: 'arrow' %}</a>
      </div>
    {%- endif -%}
  </cart-items>
</div>

<style>
  .cart-page__grid { display: grid; border-bottom: 1px solid var(--rule); }
  .cart-page__summary { border-top: 1px solid var(--rule); }
  .cart-page__summary-inner { display: grid; gap: 14px; padding: 20px var(--gutter) 40px; }
  @media (min-width: 990px) {
    .cart-page__grid { grid-template-columns: 1fr 420px; }
    .cart-page__summary { border-left: 1px solid var(--rule); }
    .cart-page__summary-inner { position: sticky; top: var(--header-h); }
    .cart-page .line { grid-template-columns: 120px 1fr auto; }
  }
</style>

{% schema %}
{
  "name": "Cart",
  "tag": "section",
  "settings": []
}
{% endschema %}
`,"/repo/theme/sections/main-collection.liquid":`{%- liquid
  assign columns = section.settings.columns
  assign active_count = 0
  for filter in collection.filters
    assign active_count = active_count | plus: filter.active_values.size
    if filter.type == 'price_range'
      if filter.min_value.value != nil or filter.max_value.value != nil
        assign active_count = active_count | plus: 1
      endif
    endif
  endfor
  assign sort_by = collection.sort_by | default: collection.default_sort_by
-%}

{{ 'collection.css' | asset_url | stylesheet_tag }}
<script src="{{ 'facets.js' | asset_url }}" type="module"><\/script>

<div class="coll-head">
  <div class="coll-head__text">
    <h1 class="t-h1">{{ collection.title | escape }}</h1>
  </div>
  {%- if collection.description != blank and section.settings.show_description -%}
    <div class="coll-head__desc rte">{{ collection.description }}</div>
  {%- endif -%}
</div>

<facet-filters class="coll" data-section-id="{{ section.id }}">
  {%- paginate collection.products by section.settings.per_page -%}
    <div class="coll__toolbar">
      {%- if section.settings.enable_filtering and collection.filters.size > 0 -%}
        <button type="button" class="t-label coll__filter-btn" data-open-dialog="facets-{{ section.id }}" aria-haspopup="dialog">
          {{ 'collections.filters.title' | t }}<span id="filter-count-{{ section.id }}">{% if active_count > 0 %} ({{ active_count }}){% endif %}</span>
        </button>
      {%- endif -%}
      <p class="t-label t-muted" id="product-count-{{ section.id }}" role="status">
        {{- 'collections.general.items_count' | t: count: collection.products_count -}}
      </p>
      {%- if section.settings.enable_sorting -%}
        <div class="coll__sort">
          <label for="sort-{{ section.id }}" class="t-label t-muted">{{ 'collections.sorting.title' | t }}</label>
          <select id="sort-{{ section.id }}" name="sort_by" class="select t-label" form="facets-form-{{ section.id }}">
            {%- for option in collection.sort_options -%}
              <option value="{{ option.value | escape }}" {% if option.value == sort_by %}selected{% endif %}>{{ option.name | escape }}</option>
            {%- endfor -%}
          </select>
        </div>
      {%- endif -%}
    </div>

    <div class="coll__body">
      {%- if section.settings.enable_filtering and collection.filters.size > 0 -%}
        <dialog class="drawer drawer--left facets" id="facets-{{ section.id }}" aria-label="{{ 'collections.filters.title' | t }}">
          <div class="drawer__head facets__head">
            <span class="t-label">{{ 'collections.filters.title' | t }}</span>
            <button type="button" class="t-label" data-close-dialog>{{ 'general.close' | t }}</button>
          </div>
          <form id="facets-form-{{ section.id }}" class="drawer__body facets__form" action="{{ collection.url }}" method="get">
            <div id="facets-body-{{ section.id }}">
              {% render 'facets', results: collection, section_id: section.id %}
            </div>
            <noscript><button type="submit" class="btn btn--block">{{ 'collections.filters.apply' | t }}</button></noscript>
          </form>
          <div class="drawer__foot facets__foot">
            <button type="button" class="btn btn--block" data-close-dialog>
              <span>{{ 'collections.filters.show_results' | t }}</span>{% render 'icon', name: 'arrow' %}
            </button>
          </div>
        </dialog>
      {%- endif -%}

      <div class="coll__results" id="results-{{ section.id }}">
        <div id="active-facets-{{ section.id }}" class="chips">
          {%- liquid
            assign clear_url = collection.url | append: '?sort_by=' | append: sort_by
          -%}
          {%- for filter in collection.filters -%}
            {%- for value in filter.active_values -%}
              <a href="{{ value.url_to_remove }}" class="chip t-label t-label--sm" data-facet-link>
                {{ value.label | escape }} {% render 'icon', name: 'close' %}
                <span class="visually-hidden">{{ 'collections.filters.remove' | t }}</span>
              </a>
            {%- endfor -%}
            {%- if filter.type == 'price_range' -%}
              {%- if filter.min_value.value != nil or filter.max_value.value != nil -%}
                <a href="{{ filter.url_to_remove }}" class="chip t-label t-label--sm" data-facet-link>
                  {{ filter.min_value.value | default: 0 | money_without_trailing_zeros }}\u2013{{ filter.max_value.value | default: filter.range_max | money_without_trailing_zeros }}
                  {% render 'icon', name: 'close' %}
                </a>
              {%- endif -%}
            {%- endif -%}
          {%- endfor -%}
          {%- if active_count > 0 -%}
            <a href="{{ clear_url }}" class="t-label t-label--sm link" data-facet-link>{{ 'collections.filters.clear_all' | t }}</a>
          {%- endif -%}
        </div>

        {%- if collection.products.size == 0 -%}
          <div class="coll__empty">
            <p class="t-h2">{{ 'collections.general.no_matches' | t }}</p>
            <a href="{{ clear_url }}" class="btn btn--outline" data-facet-link><span>{{ 'collections.filters.clear_all' | t }}</span></a>
          </div>
        {%- endif -%}

        <h2 class="visually-hidden">{{ 'collections.general.products' | t }}</h2>
        <ul role="list" class="grid grid--{{ columns }}" id="product-grid-{{ section.id }}" style="--cols-desktop: {{ columns }}" data-grid>
          {%- for product in collection.products -%}
            {%- liquid
              assign eager = false
              if forloop.index <= 2 and paginate.current_page == 1
                assign eager = true
              endif
            -%}
            <li>{% render 'product-card', product: product, columns: columns, eager: eager %}</li>
          {%- endfor -%}
        </ul>

        <div id="pager-{{ section.id }}" class="pager">
          {%- if paginate.next -%}
            <a href="{{ paginate.next.url }}" class="btn btn--outline" data-load-more>
              <span class="btn__text">{{ 'collections.general.load_more' | t }}</span>
              <span class="t-muted">{{ paginate.current_offset | plus: collection.products.size }} / {{ paginate.items }}</span>
            </a>
          {%- endif -%}
        </div>
      </div>
    </div>
  {%- endpaginate -%}
</facet-filters>

{% schema %}
{
  "name": "Product grid",
  "tag": "section",
  "class": "section-main-collection",
  "settings": [
    {
      "type": "range",
      "id": "per_page",
      "label": "Products per page",
      "min": 8,
      "max": 48,
      "step": 4,
      "default": 24
    },
    {
      "type": "select",
      "id": "columns",
      "label": "Columns (desktop)",
      "options": [
        { "value": "3", "label": "3" },
        { "value": "4", "label": "4" }
      ],
      "default": "3"
    },
    { "type": "checkbox", "id": "show_description", "label": "Show collection description", "default": true },
    { "type": "checkbox", "id": "enable_filtering", "label": "Enable filtering", "default": true, "info": "Configure filters with the Search & Discovery app." },
    { "type": "checkbox", "id": "enable_sorting", "label": "Enable sorting", "default": true }
  ]
}
{% endschema %}
`,"/repo/theme/sections/main-list-collections.liquid":`<div class="coll-head">
  <div class="coll-head__text">
    <p class="t-label t-muted">{{ 'collections.general.count' | t: count: collections.size }}</p>
    <h1 class="t-h1">{{ 'collections.general.all' | t }}</h1>
  </div>
</div>
<ul role="list" class="grid grid--3" style="--cols-desktop: 3">
  {%- for c in collections -%}
    <li>
      <a href="{{ c.url }}" class="card" style="text-decoration:none">
        <span class="card__media">
          {%- if c.featured_image -%}
            {{ c.featured_image | image_url: width: 1000 | image_tag: widths: '360, 540, 720, 1000', sizes: '(min-width: 750px) 33vw, 50vw', alt: '', loading: 'lazy' }}
          {%- else -%}
            {{ 'collection-1' | placeholder_svg_tag: 'placeholder-svg' }}
          {%- endif -%}
        </span>
        <span class="card__info">
          <span class="card__title">{{ c.title | escape }}</span>
          <span class="card__price t-label t-muted">{{ c.products_count }}</span>
        </span>
      </a>
    </li>
  {%- endfor -%}
</ul>

{% schema %}
{ "name": "Collections list", "tag": "section", "settings": [] }
{% endschema %}
`,"/repo/theme/sections/main-page.liquid":`<article class="section">
  <div class="wrap--narrow">
    <h1 class="t-h1">{{ page.title | escape }}</h1>
    <div class="rte t-body-lg" style="margin-top:32px">{{ page.content }}</div>
  </div>
</article>

{% schema %}
{ "name": "Page", "tag": "section", "settings": [] }
{% endschema %}
`,"/repo/theme/sections/main-password.liquid":`{%- liquid
  assign now = 'now' | date: '%s' | plus: 0
  assign countdown_active = false
  if section.settings.countdown_to != blank
    assign target = section.settings.countdown_to | date: '%s' | plus: 0
    if target > now
      assign countdown_active = true
    endif
  endif
-%}
<div class="pw">
  <header class="pw__top t-label">
    <span>{{ settings.wordmark | default: shop.name }}</span>
    <button type="button" class="link" data-open-dialog="pw-dialog">{{ 'password.enter_store' | t }}</button>
  </header>

  <div class="pw__main">
    <p class="t-label" style="color: var(--signal)">{{ section.settings.eyebrow | escape }}</p>
    <h1 class="t-display pw__title">{{ section.settings.heading | escape | newline_to_br }}</h1>
    {%- if countdown_active -%}
      <countdown-timer class="countdown" data-target="{{ target }}" data-format="blocks" data-after="{{ section.settings.after | escape }}"></countdown-timer>
    {%- endif -%}
  </div>

  <div class="pw__foot">
    <p class="pw__msg">{{ shop.password_message | default: section.settings.text | escape }}</p>
    {%- form 'customer', id: 'pw-signup' -%}
      <input type="hidden" name="contact[tags]" value="newsletter,drop-alert,source:password">
      {%- if form.posted_successfully? -%}
        <p class="t-label" role="status">{{ 'newsletter.success' | t }}</p>
      {%- else -%}
        <div class="inline-form" style="border-color: var(--paper)">
          <label for="pw-email" class="visually-hidden">{{ 'newsletter.label' | t }}</label>
          <input id="pw-email" class="input" type="email" name="contact[email]" required autocomplete="email" placeholder="{{ 'newsletter.placeholder' | t }}">
          <button class="btn" type="submit" style="--btn-bg: var(--paper); --btn-fg: var(--ink)"><span>{{ 'password.notify' | t }}</span></button>
        </div>
      {%- endif -%}
    {%- endform -%}
  </div>
</div>

<dialog class="modal" id="pw-dialog" aria-labelledby="pw-dialog-title">
  <div class="drawer__head">
    <span class="t-label" id="pw-dialog-title">{{ 'password.enter_store' | t }}</span>
    <button type="button" class="t-label" data-close-dialog>{{ 'general.close' | t }}</button>
  </div>
  <div class="modal__body">
    {%- form 'storefront_password' -%}
      {%- if form.errors -%}<p class="form-message form-message--error" role="alert" style="margin:0 0 12px">{{ form.errors | default_errors }}</p>{%- endif -%}
      <div class="inline-form">
        <label for="pw-input" class="visually-hidden">{{ 'password.label' | t }}</label>
        <input id="pw-input" class="input" type="password" name="password" autocomplete="current-password" placeholder="{{ 'password.label' | t }}" required>
        <button class="btn" type="submit"><span>{{ 'password.enter' | t }}</span></button>
      </div>
    {%- endform -%}
    <p class="t-label t-label--sm t-muted" style="margin-top:16px">{{ 'password.admin_link_html' | t: link: '/admin' }}</p>
  </div>
</dialog>

<style>
  .pw { min-height: 100svh; display: grid; grid-template-rows: auto 1fr auto; }
  .pw__top { display: flex; justify-content: space-between; padding: 16px var(--gutter); border-bottom: 1px solid var(--line); }
  .pw__top button { text-decoration-color: currentColor; }
  .pw__main { display: grid; align-content: center; gap: 28px; padding: 48px var(--gutter); }
  .pw__title { font-size: clamp(3.5rem, 13vw, 14rem); }
  .pw__foot { display: grid; gap: 20px; padding: 24px var(--gutter) 32px; border-top: 1px solid var(--line); }
  .pw__foot .input { color: var(--paper); }
  .pw__msg { max-width: 46ch; color: var(--fg-muted); }
  .countdown { display: flex; gap: clamp(14px, 3vw, 40px); }
  .countdown__unit { display: grid; gap: 6px; }
  .countdown__num { font-size: clamp(2.5rem, 7vw, 6rem); font-weight: 760; font-stretch: 110%; line-height: 0.9; color: var(--signal); }
  @media (min-width: 990px) {
    .pw__foot { grid-template-columns: 1fr minmax(360px, 480px); align-items: end; }
  }
</style>

{% schema %}
{
  "name": "Password page",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Drop 07 \u2014 Kemarau" },
    { "type": "textarea", "id": "heading", "label": "Heading", "default": "Not\\nyet." },
    { "type": "text", "id": "countdown_to", "label": "Count down to", "default": "2026-10-24T19:00:00+07:00" },
    { "type": "text", "id": "after", "label": "Text when countdown ends", "default": "Open now" },
    { "type": "text", "id": "text", "label": "Fallback message", "default": "140 pieces. One run. Leave your email and we'll send one message when the doors open." }
  ]
}
{% endschema %}
`,"/repo/theme/sections/main-product.liquid":`{%- liquid
  assign current_variant = product.selected_or_first_available_variant
  assign product_form_id = 'product-form-' | append: section.id
  assign size_chart = product.metafields.kala.size_chart.value
  assign threshold = settings.low_stock_threshold

-%}

{{ 'product.css' | asset_url | stylesheet_tag }}
<script src="{{ 'product.js' | asset_url }}" type="module"><\/script>

<product-page
  class="product"
  data-section-id="{{ section.id }}"
  data-product-url="{{ product.url }}"
  data-product-id="{{ product.id }}"
>
  {%- comment -%} ---------- Gallery ---------- {%- endcomment -%}
  <div class="product__gallery">
    <media-gallery class="gallery" aria-label="{{ 'products.product.gallery_label' | t }}">
      <ul class="gallery__track" role="list" data-track>
        {%- for media in product.media -%}
          <li class="gallery__item{% if forloop.first %} gallery__item--lead{% endif %}" data-media-id="{{ media.id }}" id="media-{{ section.id }}-{{ media.id }}">
            {%- case media.media_type -%}
              {%- when 'image' -%}
                {%- if forloop.first -%}
                  {{ media | image_url: width: 2000 | image_tag: widths: '480, 720, 960, 1200, 1600, 2000', sizes: '(min-width: 990px) 58vw, 100vw', alt: media.alt, loading: 'eager', fetchpriority: 'high', preload: true }}
                {%- else -%}
                  {{ media | image_url: width: 2000 | image_tag: widths: '480, 720, 960, 1200, 1600', sizes: '(min-width: 990px) 29vw, 100vw', alt: media.alt, loading: 'lazy', decoding: 'async' }}
                {%- endif -%}
              {%- when 'video' -%}
                {{ media | video_tag: autoplay: true, loop: true, muted: true, playsinline: true, controls: false, preload: 'none', image_size: '1200x' }}
              {%- when 'external_video' -%}
                {{ media | external_video_tag: loading: 'lazy' }}
              {%- else -%}
                {{ media.preview_image | image_url: width: 1600 | image_tag: loading: 'lazy', alt: media.alt }}
            {%- endcase -%}
          </li>
        {%- else -%}
          <li class="gallery__item gallery__item--lead">{{ 'apparel-1' | placeholder_svg_tag: 'placeholder-svg' }}</li>
        {%- endfor -%}
      </ul>
      {%- if product.media.size > 1 -%}
        <div class="gallery__status t-label t-label--sm" aria-hidden="true">
          <span data-current>01</span> / {{ product.media.size | prepend: '0' | slice: -2, 2 }}
        </div>
        <div class="gallery__progress" aria-hidden="true"><span data-progress style="--count: {{ product.media.size }}"></span></div>
      {%- endif -%}
    </media-gallery>
  </div>

  {%- comment -%} ---------- Info column ---------- {%- endcomment -%}
  <div class="product__info">
    <div class="product__info-inner">
      {%- for block in section.blocks -%}
        {%- case block.type -%}
          {%- when '@app' -%}
            {% render block %}

          {%- when 'title' -%}
            <div class="product__head" {{ block.shopify_attributes }}>
              <p class="t-label t-muted product__crumbs">
                {%- if product.metafields.kala.drop_code != blank -%}
                  <span>{{ product.metafields.kala.drop_code }}</span>
                {%- endif -%}
                {%- if collection -%}
                  <a href="{{ collection.url }}" class="link">{{ collection.title | escape }}</a>
                {%- elsif product.collections.first -%}
                  <a href="{{ product.collections.first.url }}" class="link">{{ product.collections.first.title | escape }}</a>
                {%- endif -%}
              </p>
              <h1 class="product__title">{{ product.title | escape }}</h1>
            </div>

          {%- when 'price' -%}
            <div class="product__price-row" {{ block.shopify_attributes }}>
              <div id="price-{{ section.id }}" class="product__price">
                {% render 'price', variant: current_variant %}
              </div>
              <p class="t-label t-label--sm t-muted">{{ 'products.product.tax_included' | t }}</p>
            </div>

          {%- when 'variant_picker' -%}
            {%- unless product.has_only_default_variant -%}
              <variant-picker class="opts" data-section-id="{{ section.id }}" {{ block.shopify_attributes }}>
                {%- for option in product.options_with_values -%}
                  {%- liquid
                    assign option_name = option.name | downcase
                    assign is_color = false
                    assign is_size = false
                    if option_name == 'color' or option_name == 'colour' or option_name == 'warna'
                      assign is_color = true
                    elsif option_name == 'size' or option_name == 'ukuran'
                      assign is_size = true
                    endif
                  -%}
                  <div class="opt" role="radiogroup" aria-labelledby="opt-label-{{ section.id }}-{{ option.position }}" data-position="{{ option.position }}">
                    <div class="opt__head">
                      <span class="t-label" id="opt-label-{{ section.id }}-{{ option.position }}">
                        {{ option.name | escape }}<span class="t-muted"> \u2014 <span data-selected-value>{{ option.selected_value | escape }}</span></span>
                      </span>
                      {%- if is_size -%}
                        <button type="button" class="t-label link" data-open-dialog="size-guide-{{ section.id }}" data-analytics="size_guide_opened">
                          {{- 'products.product.size_guide' | t -}}
                        </button>
                      {%- endif -%}
                    </div>
                    <div class="opt__values{% if is_color %} opt__values--swatch{% endif %}">
                      {%- for value in option.values -%}
                        {%- liquid
                          assign input_id = section.id | append: '-' | append: option.position | append: '-' | append: forloop.index0
                        -%}
                        <input
                          type="radio"
                          class="opt__input visually-hidden"
                          id="{{ input_id }}"
                          name="option-{{ option.position }}-{{ section.id }}"
                          value="{{ value | escape }}"
                          {% if value.selected %}checked{% endif %}
                        >
                        <label
                          for="{{ input_id }}"
                          class="opt__value t-label{% unless value.available %} is-unavailable{% endunless %}"
                          {% if is_color %}style="{% render 'swatch-style', value: value %}"{% endif %}
                        >
                          {%- if is_color -%}<span class="opt__chip" aria-hidden="true"></span>{%- endif -%}
                          <span>{{ value | escape }}</span>
                          {%- unless value.available -%}<span class="visually-hidden">, {{ 'products.product.unavailable' | t }}</span>{%- endunless -%}
                        </label>
                      {%- endfor -%}
                    </div>
                  </div>
                {%- endfor -%}
                <script type="application/json" data-variants>
                  [
                    {%- for v in product.variants -%}
                      {"id":{{ v.id }},"options":{{ v.options | json }},"available":{{ v.available | json }},"media":{{ v.featured_media.id | json }}}
                      {%- unless forloop.last %},{% endunless -%}
                    {%- endfor -%}
                  ]
                <\/script>
              </variant-picker>
            {%- endunless -%}

          {%- when 'fit_note' -%}
            {%- assign fit_note = product.metafields.kala.fit_note.value | default: block.settings.fallback -%}
            {%- if fit_note != blank -%}
              <p class="product__fit" {{ block.shopify_attributes }}>
                <span class="t-label t-muted">{{ 'products.product.fit' | t }}</span>
                <span>{{ fit_note | escape }}</span>
              </p>
            {%- endif -%}

          {%- when 'buy_buttons' -%}
            <div id="buy-{{ section.id }}" class="product__buy" {{ block.shopify_attributes }}>
              <product-form data-section-id="{{ section.id }}">
                {%- form 'product', product, id: product_form_id, novalidate: 'novalidate' -%}
                  <input type="hidden" name="id" value="{{ current_variant.id }}" data-variant-input>
                  <input type="hidden" name="quantity" value="1">
                  <button
                    type="submit"
                    name="add"
                    class="btn btn--block product__atc"
                    data-main-atc
                    {% unless current_variant.available %}
                      disabled
                    {% endunless %}
                  >
                    {%- if current_variant.available -%}
                      <span class="btn__text">{{ 'products.product.add_to_cart' | t }}</span>
                      <span>{{ current_variant.price | money }}</span>
                    {%- else -%}
                      <span class="btn__text">{{ 'products.product.sold_out' | t }}</span>
                      <span>{{ current_variant.title | escape }}</span>
                    {%- endif -%}
                  </button>
                  <p class="form-message form-message--error" role="alert" data-form-error hidden></p>
                  {%- if block.settings.show_dynamic_checkout and current_variant.available -%}
                    <div class="product__dynamic">{{ form | payment_button }}</div>
                  {%- endif -%}
                {%- endform -%}
              </product-form>

              {%- unless current_variant.available -%}
                <back-in-stock class="bis">
                  <p class="t-label">{{ 'products.back_in_stock.heading' | t: variant: current_variant.title }}</p>
                  <form class="inline-form" novalidate>
                    <label for="bis-email-{{ section.id }}" class="visually-hidden">{{ 'newsletter.label' | t }}</label>
                    <input id="bis-email-{{ section.id }}" class="input" type="email" name="email" required autocomplete="email" placeholder="{{ 'newsletter.placeholder' | t }}">
                    <input type="hidden" name="variant_id" value="{{ current_variant.id }}">
                    <input type="hidden" name="product_id" value="{{ product.id }}">
                    <button type="submit" class="btn"><span class="btn__text">{{ 'products.back_in_stock.submit' | t }}</span></button>
                  </form>
                  <p class="form-message" role="status" data-status></p>
                </back-in-stock>
              {%- endunless -%}

              <p class="product__stock t-label t-label--sm" id="inventory-{{ section.id }}">
                {%- liquid
                  if current_variant.available == false
                    echo 'products.inventory.sold_out' | t
                  elsif current_variant.inventory_management == 'shopify' and current_variant.inventory_quantity <= 0
                    echo 'products.inventory.preorder' | t
                  elsif current_variant.inventory_management == 'shopify' and current_variant.inventory_quantity <= threshold
                    echo '<span class="t-signal">'
                    echo 'products.inventory.low' | t: count: current_variant.inventory_quantity
                    echo '</span>'
                  else
                    echo 'products.inventory.in_stock' | t
                  endif
                -%}
              </p>
            </div>

          {%- when 'description' -%}
            {%- if product.description != blank -%}
              <details class="disclosure product__acc" {% if block.settings.open %}open{% endif %} {{ block.shopify_attributes }}>
                <summary class="t-label">{{ 'products.product.description' | t }}</summary>
                <div class="rte">{{ product.description }}</div>
              </details>
            {%- endif -%}

          {%- when 'details' -%}
            {%- liquid
              assign material = product.metafields.kala.material.value
              assign care = product.metafields.kala.care.value
              assign origin = product.metafields.kala.origin.value
            -%}
            {%- if material != blank or care != blank or origin != blank -%}
              <details class="disclosure product__acc" {{ block.shopify_attributes }}>
                <summary class="t-label">{{ 'products.product.material_care' | t }}</summary>
                <dl class="spec">
                  {%- if material != blank -%}<div class="spec__row"><dt class="t-label t-muted">{{ 'products.product.material' | t }}</dt><dd>{{ material | escape }}</dd></div>{%- endif -%}
                  {%- if origin != blank -%}<div class="spec__row"><dt class="t-label t-muted">{{ 'products.product.origin' | t }}</dt><dd>{{ origin | escape }}</dd></div>{%- endif -%}
                  {%- if care != blank -%}<div class="spec__row"><dt class="t-label t-muted">{{ 'products.product.care' | t }}</dt><dd>{{ care | escape }}</dd></div>{%- endif -%}
                </dl>
              </details>
            {%- endif -%}

          {%- when 'collapsible' -%}
            <details class="disclosure product__acc" {{ block.shopify_attributes }}>
              <summary class="t-label">{{ block.settings.heading | escape }}</summary>
              <div class="rte">
                {{ block.settings.content }}
                {{ block.settings.page.content }}
              </div>
            </details>
        {%- endcase -%}
      {%- endfor -%}

      {%- comment -%} Complete the look, driven by a product list metafield. {%- endcomment -%}
      {%- assign pairs = product.metafields.kala.complementary.value -%}
      {%- if pairs != blank -%}
        <div class="product__pairs">
          <p class="t-label t-muted">{{ 'products.product.pairs_with' | t }}</p>
          <ul role="list">
            {%- for p in pairs limit: 3 -%}
              <li class="pair">
                <div class="pair__img media">
                  {%- if p.featured_image -%}
                    {{ p.featured_image | image_url: width: 200 | image_tag: widths: '64, 128, 200', sizes: '64px', alt: '', loading: 'lazy' }}
                  {%- endif -%}
                </div>
                <a href="{{ p.url }}" class="pair__name">{{ p.title | escape }}</a>
                <span>{% render 'price', product: p %}</span>
              </li>
            {%- endfor -%}
          </ul>
        </div>
      {%- endif -%}
    </div>
  </div>

  {%- comment -%} Sticky add-to-bag. Submits the main form via the form attribute. {%- endcomment -%}
  <sticky-atc class="sticky-atc" id="sticky-{{ section.id }}" hidden>
    <div class="sticky-atc__info">
      <span class="sticky-atc__title">{{ product.title | escape }}</span>
      <span class="t-label t-label--sm t-muted">
        {%- unless product.has_only_default_variant %}{{ current_variant.title | escape }} \xB7 {% endunless -%}
        {{ current_variant.price | money }}
      </span>
    </div>
    <button
      type="submit"
      name="add"
      form="{{ product_form_id }}"
      class="btn"
      {% unless current_variant.available %}
        disabled
      {% endunless %}
    >
      <span class="btn__text">
        {%- if current_variant.available -%}{{ 'products.product.add_to_cart' | t }}{%- else -%}{{ 'products.product.sold_out' | t }}{%- endif -%}
      </span>
    </button>
  </sticky-atc>
</product-page>

{%- comment -%} Size guide: metafield JSON first, page fallback second. {%- endcomment -%}
<dialog class="modal" id="size-guide-{{ section.id }}" aria-labelledby="size-guide-title-{{ section.id }}">
  <div class="drawer__head">
    <span class="t-label" id="size-guide-title-{{ section.id }}">{{ 'products.product.size_guide' | t }}{% if size_chart.unit %} ({{ size_chart.unit }}){% endif %}</span>
    <button type="button" class="t-label" data-close-dialog>{{ 'general.close' | t }}</button>
  </div>
  <div class="modal__body">
    {%- if size_chart.rows -%}
      <div class="size-table-wrap">
        <table class="size-table">
          <thead>
            <tr>
              {%- for col in size_chart.columns -%}<th scope="col" class="t-label">{{ col | escape }}</th>{%- endfor -%}
            </tr>
          </thead>
          <tbody>
            {%- for row in size_chart.rows -%}
              <tr>
                {%- for cell in row -%}
                  {%- if forloop.first -%}<th scope="row" class="t-label">{{ cell | escape }}</th>{%- else -%}<td>{{ cell | escape }}</td>{%- endif -%}
                {%- endfor -%}
              </tr>
            {%- endfor -%}
          </tbody>
        </table>
      </div>
      {%- if size_chart.note -%}<p class="t-muted" style="margin-top:16px">{{ size_chart.note | escape }}</p>{%- endif -%}
    {%- elsif section.settings.size_guide_page != blank -%}
      <div class="rte">{{ section.settings.size_guide_page.content }}</div>
    {%- else -%}
      <p class="t-muted">{{ 'products.product.size_guide_missing' | t }}</p>
    {%- endif -%}
  </div>
</dialog>

<script type="application/ld+json">
  {{ product | structured_data }}
<\/script>

{% schema %}
{
  "name": "Product information",
  "tag": "section",
  "class": "section-main-product",
  "settings": [
    {
      "type": "page",
      "id": "size_guide_page",
      "label": "Fallback size guide page",
      "info": "Used when a product has no kala.size_chart metafield."
    }
  ],
  "blocks": [
    { "type": "@app" },
    { "type": "title", "name": "Title", "limit": 1 },
    { "type": "price", "name": "Price", "limit": 1 },
    { "type": "variant_picker", "name": "Variant picker", "limit": 1 },
    {
      "type": "fit_note",
      "name": "Fit note",
      "limit": 1,
      "settings": [
        {
          "type": "text",
          "id": "fallback",
          "label": "Fallback text",
          "info": "Shown when the product has no kala.fit_note metafield."
        }
      ]
    },
    {
      "type": "buy_buttons",
      "name": "Buy buttons",
      "limit": 1,
      "settings": [
        { "type": "checkbox", "id": "show_dynamic_checkout", "label": "Show dynamic checkout buttons", "default": false }
      ]
    },
    {
      "type": "description",
      "name": "Description",
      "limit": 1,
      "settings": [{ "type": "checkbox", "id": "open", "label": "Open by default", "default": true }]
    },
    { "type": "details", "name": "Material & care (metafields)", "limit": 1 },
    {
      "type": "collapsible",
      "name": "Collapsible tab",
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Shipping & returns" },
        { "type": "richtext", "id": "content", "label": "Content" },
        { "type": "page", "id": "page", "label": "Content from page" }
      ]
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/main-search.liquid":`{%- liquid
  assign columns = section.settings.columns
-%}
{{ 'collection.css' | asset_url | stylesheet_tag }}
<script src="{{ 'facets.js' | asset_url }}" type="module"><\/script>

<div class="coll-head">
  <div class="coll-head__text">
    <p class="t-label t-muted">{{ 'search.title' | t }}</p>
    <form action="{{ routes.search_url }}" method="get" role="search" class="inline-form" style="max-width:640px">
      <label for="search-page-input" class="visually-hidden">{{ 'search.label' | t }}</label>
      <input id="search-page-input" class="input" type="search" name="q" value="{{ search.terms | escape }}" placeholder="{{ 'search.placeholder' | t }}">
      <input type="hidden" name="options[prefix]" value="last">
      <input type="hidden" name="type" value="product">
      <button class="btn" type="submit"><span>{{ 'search.submit' | t }}</span></button>
    </form>
  </div>
</div>

{%- if search.performed -%}
  <facet-filters class="coll" data-section-id="{{ section.id }}">
    {%- paginate search.results by 24 -%}
      <div class="coll__toolbar">
        {%- if search.filters.size > 0 -%}
          <button type="button" class="t-label coll__filter-btn" data-open-dialog="facets-{{ section.id }}" aria-haspopup="dialog">{{ 'collections.filters.title' | t }}<span id="filter-count-{{ section.id }}"></span></button>
        {%- endif -%}
        <p class="t-label t-muted" id="product-count-{{ section.id }}" role="status">{{ 'search.results_count' | t: count: search.results_count, terms: search.terms }}</p>
        <div class="coll__sort">
          <label for="sort-{{ section.id }}" class="t-label t-muted">{{ 'collections.sorting.title' | t }}</label>
          <select id="sort-{{ section.id }}" name="sort_by" class="select t-label" form="facets-form-{{ section.id }}">
            {%- assign sort_by = search.sort_by | default: search.default_sort_by -%}
            {%- for option in search.sort_options -%}
              <option value="{{ option.value | escape }}" {% if option.value == sort_by %}selected{% endif %}>{{ option.name | escape }}</option>
            {%- endfor -%}
          </select>
        </div>
      </div>
      <div class="coll__body">
        <dialog class="drawer drawer--left facets" id="facets-{{ section.id }}" aria-label="{{ 'collections.filters.title' | t }}">
          <div class="drawer__head facets__head">
            <span class="t-label">{{ 'collections.filters.title' | t }}</span>
            <button type="button" class="t-label" data-close-dialog>{{ 'general.close' | t }}</button>
          </div>
          <form id="facets-form-{{ section.id }}" class="drawer__body facets__form" action="{{ routes.search_url }}" method="get">
            <input type="hidden" name="type" value="product">
            <div id="facets-body-{{ section.id }}">{% render 'facets', results: search, section_id: section.id %}</div>
          </form>
          <div class="drawer__foot facets__foot">
            <button type="button" class="btn btn--block" data-close-dialog><span>{{ 'collections.filters.show_results' | t }}</span></button>
          </div>
        </dialog>
        <div class="coll__results" id="results-{{ section.id }}">
          <div id="active-facets-{{ section.id }}" class="chips">
            {%- for filter in search.filters -%}
              {%- for value in filter.active_values -%}
                <a href="{{ value.url_to_remove }}" class="chip t-label t-label--sm" data-facet-link>{{ value.label | escape }} {% render 'icon', name: 'close' %}</a>
              {%- endfor -%}
            {%- endfor -%}
          </div>
          {%- if search.results_count == 0 -%}
            <div class="coll__empty"><p class="t-h2">{{ 'search.no_results' | t: terms: search.terms }}</p></div>
          {%- endif -%}
          <h2 class="visually-hidden">{{ 'collections.general.products' | t }}</h2>
          <ul role="list" class="grid grid--{{ columns }}" id="product-grid-{{ section.id }}" style="--cols-desktop: {{ columns }}" data-grid>
            {%- for item in search.results -%}
              {%- if item.object_type == 'product' -%}
                <li>{% render 'product-card', product: item, columns: columns %}</li>
              {%- endif -%}
            {%- endfor -%}
          </ul>
          <div id="pager-{{ section.id }}" class="pager">
            {%- if paginate.next -%}
              <a href="{{ paginate.next.url }}" class="btn btn--outline" data-load-more><span class="btn__text">{{ 'collections.general.load_more' | t }}</span></a>
            {%- endif -%}
          </div>
        </div>
      </div>
    {%- endpaginate -%}
  </facet-filters>
{%- endif -%}

{% schema %}
{
  "name": "Search results",
  "tag": "section",
  "settings": [
    {
      "type": "select",
      "id": "columns",
      "label": "Columns (desktop)",
      "options": [
        { "value": "3", "label": "3" },
        { "value": "4", "label": "4" }
      ],
      "default": "3"
    }
  ]
}
{% endschema %}
`,"/repo/theme/sections/predictive-search.liquid":`{%- comment -%}
  Rendered via /search/suggest?section_id=predictive-search. Not added to
  templates; the header's <predictive-search> element requests it directly.
{%- endcomment -%}
{%- if predictive_search.performed -%}
  {%- assign res = predictive_search.resources -%}
  <div class="ps">
    {%- if res.queries.size > 0 -%}
      <div class="ps__group">
        <p class="t-label t-muted ps__label">{{ 'search.suggestions' | t }}</p>
        <ul role="list" class="ps__queries">
          {%- for q in res.queries -%}
            <li><a href="{{ q.url }}" class="t-label">{{ q.styled_text }}</a></li>
          {%- endfor -%}
        </ul>
      </div>
    {%- endif -%}

    {%- if res.products.size > 0 -%}
      <div class="ps__group">
        <p class="t-label t-muted ps__label">{{ 'search.products' | t }}</p>
        <ul role="list">
          {%- for product in res.products -%}
            <li>
              <a href="{{ product.url }}" class="ps__row">
                <span class="ps__img media">
                  {%- if product.featured_image -%}
                    {{ product.featured_image | image_url: width: 120 | image_tag: widths: '56, 112', sizes: '56px', alt: '', loading: 'lazy' }}
                  {%- endif -%}
                </span>
                <span>
                  <span class="ps__title">{{ product.title }}</span>
                  {%- if product.metafields.kala.drop_code != blank -%}
                    <span class="t-label t-label--sm t-muted">{{ product.metafields.kala.drop_code }}</span>
                  {%- endif -%}
                </span>
                <span>{% render 'price', product: product %}</span>
              </a>
            </li>
          {%- endfor -%}
        </ul>
      </div>
    {%- endif -%}

    {%- if res.collections.size > 0 -%}
      <div class="ps__group">
        <p class="t-label t-muted ps__label">{{ 'search.collections' | t }}</p>
        <ul role="list" class="ps__queries">
          {%- for c in res.collections -%}
            <li><a href="{{ c.url }}" class="t-label">{{ c.title | escape }}</a></li>
          {%- endfor -%}
        </ul>
      </div>
    {%- endif -%}

    <a href="{{ routes.search_url }}?q={{ predictive_search.terms | url_encode }}&options%5Bprefix%5D=last" class="ps__all t-label">
      <span>{{ 'search.view_all' | t: terms: predictive_search.terms }}</span>{% render 'icon', name: 'arrow' %}
    </a>
  </div>
  <style>
    .ps { display: grid; }
    .ps__group { border-bottom: 1px solid var(--rule); padding-bottom: 8px; }
    .ps__label { padding: 14px var(--gutter) 6px; }
    .ps__queries { display: flex; flex-wrap: wrap; gap: 8px 20px; padding: 4px var(--gutter) 8px; }
    .ps__queries a { text-decoration: none; }
    .ps__queries mark { background: none; color: var(--signal); }
    .ps__row {
      display: grid;
      grid-template-columns: 56px 1fr auto;
      gap: 16px;
      align-items: center;
      padding: 8px var(--gutter);
      text-decoration: none;
    }
    .ps__row:hover, .ps__row:focus-visible { background: rgba(var(--ink-rgb), 0.05); outline-offset: -2px; }
    .ps__img { aspect-ratio: 4 / 5; }
    .ps__img img { width: 100%; height: 100%; object-fit: cover; }
    .ps__title { display: block; font-weight: 550; }
    .ps__all { display: flex; justify-content: space-between; padding: 18px var(--gutter); text-decoration: none; background: var(--ink); color: var(--paper); }
  </style>
{%- endif -%}
`,"/repo/theme/sections/product-recommendations.liquid":`{%- comment -%}
  Loaded lazily: the server renders an empty shell, then the element fetches
  /recommendations/products?section_id=\u2026 once it nears the viewport. Uses the
  Search & Discovery "complementary" intent when configured, else "related".
{%- endcomment -%}
<product-recommendations
  class="recs"
  data-url="{{ routes.product_recommendations_url }}?section_id={{ section.id }}&product_id={{ product.id }}&limit={{ section.settings.limit }}&intent={{ section.settings.intent }}"
>
  {%- if recommendations.performed and recommendations.products_count > 0 -%}
    <div class="sec-head">
      <span class="t-label t-muted">{{ section.settings.index_label | escape }}</span>
      <h2 class="sec-head__title">{{ section.settings.heading | escape }}</h2>
      <span></span>
    </div>
    <ul role="list" class="grid grid--4" style="--cols-desktop: 4">
      {%- for rec in recommendations.products -%}
        <li>{% render 'product-card', product: rec, columns: 4 %}</li>
      {%- endfor -%}
    </ul>
  {%- endif -%}
</product-recommendations>

<script type="module">
  if (!customElements.get('product-recommendations')) {
    customElements.define(
      'product-recommendations',
      class extends HTMLElement {
        connectedCallback() {
          const io = new IntersectionObserver(
            async ([entry]) => {
              if (!entry.isIntersecting) return;
              io.disconnect();
              const res = await fetch(this.dataset.url);
              if (!res.ok) return;
              const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
              const next = doc.querySelector('product-recommendations');
              if (next?.innerHTML.trim()) this.innerHTML = next.innerHTML;
            },
            { rootMargin: '0px 0px 400px 0px' }
          );
          io.observe(this);
        }
      }
    );
  }
<\/script>

{% schema %}
{
  "name": "Product recommendations",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "index_label", "label": "Index label", "default": "\u2014" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Wear it with" },
    {
      "type": "select",
      "id": "intent",
      "label": "Intent",
      "options": [
        { "value": "complementary", "label": "Complementary" },
        { "value": "related", "label": "Related" }
      ],
      "default": "related"
    },
    { "type": "range", "id": "limit", "label": "Products", "min": 2, "max": 8, "step": 1, "default": 4 }
  ],
  "presets": [{ "name": "Product recommendations" }]
}
{% endschema %}
`,"/repo/theme/sections/production-notes.liquid":`{%- comment -%}
  Editorial block: a short statement plus a spec sheet. Brand storytelling
  that reads like a garment tag, not a marketing page.
{%- endcomment -%}
<section class="notes section scheme-{{ section.settings.color_scheme }}" aria-labelledby="notes-title-{{ section.id }}">
  <div class="wrap notes__grid">
    <div class="notes__lead">
      <p class="t-label t-muted">{{ section.settings.index_label | escape }}</p>
      <h2 class="t-h1" id="notes-title-{{ section.id }}">{{ section.settings.heading | escape | newline_to_br }}</h2>
    </div>
    <div class="notes__body">
      <div class="rte t-body-lg">{{ section.settings.text }}</div>
      {%- if section.blocks.size > 0 -%}
        <dl class="spec notes__spec">
          {%- for block in section.blocks -%}
            <div class="spec__row" {{ block.shopify_attributes }}>
              <dt class="t-label t-muted">{{ block.settings.label | escape }}</dt>
              <dd>{{ block.settings.value | escape }}</dd>
            </div>
          {%- endfor -%}
        </dl>
      {%- endif -%}
      {%- if section.settings.link_label != blank -%}
        <a href="{{ section.settings.link }}" class="t-label link-arrow" style="margin-top:24px">{{ section.settings.link_label | escape }} {% render 'icon', name: 'arrow' %}</a>
      {%- endif -%}
    </div>
  </div>
</section>

<style>
  .notes__grid { display: grid; gap: 32px; }
  .notes__lead { display: grid; gap: 16px; align-content: start; }
  .notes__body { max-width: 640px; }
  .notes__spec { margin-top: 32px; }
  .notes .spec__row { padding-block: 12px; }
  @media (min-width: 990px) {
    .notes__grid { grid-template-columns: 5fr 6fr; gap: var(--gutter); }
    .notes__body { padding-top: 32px; }
  }
</style>

{% schema %}
{
  "name": "Production notes",
  "tag": "div",
  "max_blocks": 8,
  "settings": [
    {
      "type": "select",
      "id": "color_scheme",
      "label": "Color scheme",
      "options": [
        { "value": "paper", "label": "Paper" },
        { "value": "ink", "label": "Ink" },
        { "value": "signal", "label": "Signal" }
      ],
      "default": "paper"
    },
    { "type": "text", "id": "index_label", "label": "Index label", "default": "03 \u2014 How it was made" },
    { "type": "textarea", "id": "heading", "label": "Heading", "default": "Six tailors.\\nThree weeks.\\nNo second run." },
    {
      "type": "richtext",
      "id": "text",
      "label": "Text",
      "default": "<p>Every drop is cut from a single bolt order. When the cloth is gone, the drop is gone. Offcuts become the tote that ships with your order.</p>"
    },
    { "type": "text", "id": "link_label", "label": "Link label", "default": "Read the production log" },
    { "type": "url", "id": "link", "label": "Link" }
  ],
  "blocks": [
    {
      "type": "row",
      "name": "Spec row",
      "settings": [
        { "type": "text", "id": "label", "label": "Label", "default": "Cloth" },
        { "type": "text", "id": "value", "label": "Value", "default": "Ramie linen, 180 gsm" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Production notes",
      "blocks": [
        { "type": "row", "settings": { "label": "Cloth", "value": "Ramie linen, 180 gsm, woven in Majalaya" } },
        { "type": "row", "settings": { "label": "Workshop", "value": "Cigadung, Bandung \u2014 6 tailors" } },
        { "type": "row", "settings": { "label": "Lead time", "value": "21 days from cut to fold" } },
        { "type": "row", "settings": { "label": "Run", "value": "140 pieces across 12 styles" } }
      ]
    }
  ]
}
{% endschema %}
`,"/repo/theme/snippets/cart-lines.liquid":`{%- comment -%}
  Line items shared by the cart drawer and the cart page.
  The parent <cart-items> element handles quantity and remove clicks.
{%- endcomment -%}
<ul role="list" class="cart-lines">
  {%- for item in cart.items -%}
    <li class="line" data-line="{{ forloop.index }}" data-key="{{ item.key }}">
      <a href="{{ item.url }}" class="line__media" tabindex="-1" aria-hidden="true">
        {%- if item.image -%}
          {{ item.image | image_url: width: 240 | image_tag: widths: '84, 168, 240', sizes: '84px', alt: '', loading: 'lazy' }}
        {%- endif -%}
      </a>
      <div>
        <a href="{{ item.url }}" class="line__title">{{ item.product.title | escape }}</a>
        <p class="line__options t-label t-label--sm t-muted">
          {%- unless item.product.has_only_default_variant -%}
            {%- for option in item.options_with_values -%}
              {{ option.value }}{% unless forloop.last %} / {% endunless %}
            {%- endfor -%}
          {%- endunless -%}
          {%- for property in item.properties -%}
            {%- assign first_char = property.first | slice: 0 -%}
            {%- if property.last != blank and first_char != '_' -%}
              <br>{{ property.first }}: {{ property.last }}
            {%- endif -%}
          {%- endfor -%}
        </p>
        {%- for discount in item.line_level_discount_allocations -%}
          <p class="t-label t-label--sm t-signal">{{ discount.discount_application.title }} (&minus;{{ discount.amount | money }})</p>
        {%- endfor -%}
        <div class="line__actions">
          <div class="qty">
            <button type="button" data-qty-step="-1" aria-label="{{ 'cart.general.decrease' | t: product: item.product.title | escape }}">{% render 'icon', name: 'minus' %}</button>
            <input
              type="number"
              inputmode="numeric"
              min="0"
              value="{{ item.quantity }}"
              data-qty-input
              aria-label="{{ 'cart.general.quantity_for' | t: product: item.product.title | escape }}"
              {% if item.variant.inventory_management == 'shopify' and item.variant.inventory_policy == 'deny' %}
                max="{{ item.variant.inventory_quantity }}"
              {% endif %}
            >
            <button type="button" data-qty-step="1" aria-label="{{ 'cart.general.increase' | t: product: item.product.title | escape }}">{% render 'icon', name: 'plus' %}</button>
          </div>
          <button type="button" class="line__remove t-label t-label--sm" data-remove>{{ 'cart.general.remove' | t }}</button>
        </div>
      </div>
      <div class="line__price">
        {%- if item.original_line_price > item.final_line_price -%}
          <s class="t-muted">{{ item.original_line_price | money }}</s><br>
        {%- endif -%}
        {{ item.final_line_price | money }}
      </div>
    </li>
  {%- endfor -%}
</ul>
`,"/repo/theme/snippets/facets.liquid":`{%- comment -%}
  Storefront filters for a collection or search results.
  - results: collection or search object (both expose .filters)
  - section_id
  Field names come from Shopify (filter.v.option.size, filter.v.price.gte \u2026),
  so the same form also works as a plain GET form without JavaScript.
{%- endcomment -%}
{%- for filter in results.filters -%}
  {%- liquid
    assign is_open = false
    if forloop.index <= 2 or filter.active_values.size > 0
      assign is_open = true
    endif
  -%}
  <details class="disclosure facet" id="facet-{{ section_id }}-{{ filter.param_name | handle }}" {% if is_open %}open{% endif %}>
    <summary class="t-label">
      <span>
        {{- filter.label | escape -}}
        {%- if filter.active_values.size > 0 %} <span class="t-signal">({{ filter.active_values.size }})</span>{% endif -%}
      </span>
    </summary>

    {%- case filter.type -%}
      {%- when 'list' -%}
        <ul role="list" class="facet__list{% if filter.presentation == 'swatch' %} facet__list--swatch{% endif %}">
          {%- for value in filter.values -%}
            {%- assign input_id = 'f-' | append: section_id | append: '-' | append: filter.param_name | handle | append: '-' | append: forloop.index -%}
            <li>
              <input
                type="checkbox"
                class="visually-hidden facet__input"
                id="{{ input_id }}"
                name="{{ value.param_name }}"
                value="{{ value.value }}"
                {% if value.active %}checked{% endif %}
                {% if value.count == 0 and value.active == false %}disabled{% endif %}
              >
              <label for="{{ input_id }}" class="facet__option{% if value.count == 0 and value.active == false %} is-empty{% endif %}">
                {%- if filter.presentation == 'swatch' -%}
                  <span class="swatch" style="{% render 'swatch-style', value: value %}" aria-hidden="true"></span>
                {%- else -%}
                  <span class="facet__box" aria-hidden="true"></span>
                {%- endif -%}
                <span>{{ value.label | escape }}</span>
                <span class="t-muted facet__count">{{ value.count }}</span>
              </label>
            </li>
          {%- endfor -%}
        </ul>

      {%- when 'boolean' -%}
        <ul role="list" class="facet__list">
          {%- for value in filter.values -%}
            {%- assign input_id = 'f-' | append: section_id | append: '-' | append: filter.param_name | handle | append: '-' | append: forloop.index -%}
            <li>
              <input type="checkbox" class="visually-hidden facet__input" id="{{ input_id }}" name="{{ value.param_name }}" value="{{ value.value }}" {% if value.active %}checked{% endif %}>
              <label for="{{ input_id }}" class="facet__option">
                <span class="facet__box" aria-hidden="true"></span>
                <span>{{ value.label | escape }}</span>
                <span class="t-muted facet__count">{{ value.count }}</span>
              </label>
            </li>
          {%- endfor -%}
        </ul>

      {%- when 'price_range' -%}
        {%- liquid
          assign currency_symbol = cart.currency.symbol | default: cart.currency.iso_code
          assign max_major = filter.range_max | divided_by: 100.0 | ceil
        -%}
        <div class="facet__price">
          <div class="field">
            <label class="t-label t-label--sm t-muted" for="price-min-{{ section_id }}">{{ 'collections.filters.from' | t }} ({{ currency_symbol }})</label>
            <input
              class="input"
              id="price-min-{{ section_id }}"
              type="number"
              inputmode="numeric"
              min="0"
              max="{{ max_major }}"
              name="{{ filter.min_value.param_name }}"
              {% if filter.min_value.value %}value="{{ filter.min_value.value | divided_by: 100.0 | round }}"{% endif %}
              placeholder="0"
              data-debounce
            >
          </div>
          <div class="field">
            <label class="t-label t-label--sm t-muted" for="price-max-{{ section_id }}">{{ 'collections.filters.to' | t }} ({{ currency_symbol }})</label>
            <input
              class="input"
              id="price-max-{{ section_id }}"
              type="number"
              inputmode="numeric"
              min="0"
              max="{{ max_major }}"
              name="{{ filter.max_value.param_name }}"
              {% if filter.max_value.value %}value="{{ filter.max_value.value | divided_by: 100.0 | round }}"{% endif %}
              placeholder="{{ max_major }}"
              data-debounce
            >
          </div>
        </div>
    {%- endcase -%}
  </details>
{%- endfor -%}

{%- if results.terms -%}
  <input type="hidden" name="q" value="{{ results.terms | escape }}">
  <input type="hidden" name="options[prefix]" value="last">
{%- endif -%}
`,"/repo/theme/snippets/free-shipping-meter.liquid":`{%- comment -%}
  Progress towards free shipping. The threshold is stored in the shop's
  currency, so the meter only renders when the customer is checking out in
  that currency; showing a converted number that disagrees with the checkout
  rule would be worse than showing nothing.
{%- endcomment -%}
{%- liquid
  assign threshold = settings.free_shipping_threshold | times: 100
  assign show_meter = false
  if threshold > 0 and cart.currency.iso_code == shop.currency and cart.item_count > 0
    assign show_meter = true
  endif
-%}
{%- if show_meter -%}
  {%- liquid
    assign remaining = threshold | minus: cart.total_price
    assign remaining_money = remaining | money
    assign progress = cart.total_price | times: 1.0 | divided_by: threshold
    if progress > 1
      assign progress = 1
    endif
  -%}
  <div class="ship-meter{% if remaining <= 0 %} ship-meter--done{% endif %}">
    <p class="t-label">
      {%- if remaining > 0 -%}
        {{ 'cart.shipping.remaining_html' | t: amount: remaining_money }}
      {%- else -%}
        {{ 'cart.shipping.unlocked' | t }}
      {%- endif -%}
    </p>
    <div
      class="ship-meter__track"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="{{ progress | times: 100 | round }}"
      aria-label="{{ 'cart.shipping.progress_label' | t }}"
    >
      <div class="ship-meter__fill" style="--progress: {{ progress }}"></div>
    </div>
  </div>
{%- endif -%}
`,"/repo/theme/snippets/icon.liquid":`{%- comment -%}
  Inline icons, 16\xD716 grid, 1.4 stroke. Usage: {% render 'icon', name: 'arrow' %}
{%- endcomment -%}
{%- case name -%}
  {%- when 'arrow' -%}
    <svg class="icon arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
  {%- when 'arrow-left' -%}
    <svg class="icon arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M15 8H2M7 3L2 8l5 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
  {%- when 'close' -%}
    <svg class="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2 2l12 12M14 2L2 14" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
  {%- when 'plus' -%}
    <svg class="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
  {%- when 'minus' -%}
    <svg class="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2 8h12" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
  {%- when 'search' -%}
    <svg class="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M11 11l4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
{%- endcase -%}
`,"/repo/theme/snippets/image.liquid":`{%- comment -%}
  Responsive image wrapper around image_tag.
  - image (required)
  - sizes: sizes attribute (default 100vw)
  - widths: candidate widths (default covers phone \u2192 2x desktop)
  - class
  - eager: true for above-the-fold LCP candidates. Sets fetchpriority=high and
    emits a preload Link header via \`preload: true\`.
  - alt: override alt text
{%- endcomment -%}
{%- liquid
  assign sizes = sizes | default: '100vw'
  assign widths = widths | default: '360, 540, 720, 960, 1200, 1600, 2000'
  assign alt_text = alt | default: image.alt
-%}
{%- if eager -%}
  {{ image | image_url: width: 2000 | image_tag: widths: widths, sizes: sizes, class: class, alt: alt_text, loading: 'eager', fetchpriority: 'high', preload: true }}
{%- else -%}
  {{ image | image_url: width: 2000 | image_tag: widths: widths, sizes: sizes, class: class, alt: alt_text, loading: 'lazy', decoding: 'async' }}
{%- endif -%}
`,"/repo/theme/snippets/meta-tags.liquid":`{%- liquid
  assign og_title = page_title | default: shop.name
  assign og_url = canonical_url | default: request.origin
  assign og_type = 'website'
  assign og_description = page_description | default: shop.description | default: shop.name
  if request.page_type == 'product'
    assign og_type = 'product'
  elsif request.page_type == 'article'
    assign og_type = 'article'
  elsif request.page_type == 'password'
    assign og_url = request.origin
  endif
-%}
<meta property="og:site_name" content="{{ shop.name }}">
<meta property="og:url" content="{{ og_url }}">
<meta property="og:title" content="{{ og_title | escape }}">
<meta property="og:type" content="{{ og_type }}">
<meta property="og:description" content="{{ og_description | escape }}">
{%- if page_image -%}
  <meta property="og:image" content="http:{{ page_image | image_url: width: 1200 }}">
  <meta property="og:image:secure_url" content="https:{{ page_image | image_url: width: 1200 }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="{{ 1200 | divided_by: page_image.aspect_ratio | round }}">
{%- endif -%}
{%- if request.page_type == 'product' -%}
  <meta property="og:price:amount" content="{{ product.price | money_without_currency | strip_html }}">
  <meta property="og:price:currency" content="{{ cart.currency.iso_code }}">
{%- endif -%}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ og_title | escape }}">
<meta name="twitter:description" content="{{ og_description | escape }}">
`,"/repo/theme/snippets/price.liquid":`{%- comment -%}
  Renders a price for a product or a variant.
  - product: product object (uses the lowest price, "from" when prices vary)
  - variant: variant object (overrides product)
{%- endcomment -%}
{%- liquid
  if variant
    assign current = variant.price
    assign compare = variant.compare_at_price
    assign varies = false
  else
    assign current = product.price_min
    assign compare = product.compare_at_price_min
    assign varies = product.price_varies
  endif
  assign current_formatted = current | money
  assign on_sale = false
  if compare > current
    assign on_sale = true
  endif
-%}
<span class="price{% if on_sale %} price--sale{% endif %}">
  {%- if on_sale -%}
    <span class="visually-hidden">{{ 'products.product.regular_price' | t }}</span>
    <s>{{ compare | money }}</s>
    <span class="visually-hidden">{{ 'products.product.sale_price' | t }}</span>
  {%- endif -%}
  <span class="price__current">
    {%- if varies -%}{{ 'products.product.from_price' | t: price: current_formatted }}{%- else -%}{{ current_formatted }}{%- endif -%}
  </span>
</span>
`,"/repo/theme/snippets/product-card.liquid":`{%- comment -%}
  Product card.
  - product (required)
  - columns: desktop column count, used for the sizes attribute (default 4)
  - eager: load the image eagerly (first row of a collection page)
{%- endcomment -%}
{%- liquid
  assign columns = columns | default: 4
  assign image_sizes = '(min-width: 750px) calc(100vw / ' | append: columns | append: '), 50vw'

  assign primary = product.featured_media.preview_image
  assign secondary = nil
  if settings.card_hover_image and product.media.size > 1
    assign secondary = product.media[1].preview_image
  endif

  assign color_option = nil
  for option in product.options_with_values
    assign option_name = option.name | downcase
    if option_name == 'color' or option_name == 'colour' or option_name == 'warna'
      assign color_option = option
    endif
  endfor

  comment
    Sum managed inventory so the card can flag "last few" without a request.
    Variants that are not tracked by Shopify are treated as unlimited.
  endcomment
  assign tracked_total = 0
  assign untracked = false
  for variant in product.variants
    if variant.inventory_management == 'shopify' and variant.inventory_policy == 'deny'
      if variant.inventory_quantity > 0
        assign tracked_total = tracked_total | plus: variant.inventory_quantity
      endif
    else
      assign untracked = true
    endif
  endfor
  assign low_stock = false
  if product.available and untracked == false and tracked_total <= settings.low_stock_threshold
    assign low_stock = true
  endif

  assign discount_pct = 0
  if product.compare_at_price_min > product.price_min
    assign diff = product.compare_at_price_min | minus: product.price_min | times: 100.0
    assign discount_pct = diff | divided_by: product.compare_at_price_min | round
  endif

  assign show_quick_add = false
  if settings.card_quick_add and product.available and product.options.size == 1
    assign show_quick_add = true
  endif
-%}
<article class="card" data-product-id="{{ product.id }}">
  <div class="card__visual">
  <a href="{{ product.url }}" class="card__media" tabindex="-1" aria-hidden="true">
    {%- if primary -%}
      {%- if eager -%}
        {{ primary | image_url: width: 1200 | image_tag: widths: '240, 360, 480, 640, 800, 1000', sizes: image_sizes, alt: '', loading: 'eager', fetchpriority: 'high' }}
      {%- else -%}
        {{ primary | image_url: width: 1200 | image_tag: widths: '240, 360, 480, 640, 800, 1000', sizes: image_sizes, alt: '', loading: 'lazy', decoding: 'async' }}
      {%- endif -%}
      {%- if secondary -%}
        {{ secondary | image_url: width: 1200 | image_tag: widths: '240, 360, 480, 640, 800, 1000', sizes: image_sizes, alt: '', loading: 'lazy', decoding: 'async', class: 'card__alt' }}
      {%- endif -%}
    {%- else -%}
      {{ 'apparel-1' | placeholder_svg_tag: 'placeholder-svg' }}
    {%- endif -%}
  </a>

  <div class="card__badges">
    {%- if product.available == false -%}
      <span class="badge badge--ink t-label t-label--sm">{{ 'products.product.sold_out' | t }}</span>
    {%- elsif low_stock -%}
      <span class="badge badge--signal t-label t-label--sm">{{ 'products.product.last_units' | t: count: tracked_total }}</span>
    {%- elsif discount_pct > 0 -%}
      <span class="badge badge--signal t-label t-label--sm">&minus;{{ discount_pct }}%</span>
    {%- endif -%}
  </div>

  {%- if show_quick_add -%}
    <quick-add class="quick-add" data-product-handle="{{ product.handle }}">
      <span class="quick-add__label t-label t-label--sm t-muted">
        {%- if product.has_only_default_variant -%}
          {{- 'products.product.quick_add' | t -}}
        {%- else -%}
          {{- 'products.product.quick_add_option' | t: option: product.options.first -}}
        {%- endif -%}
      </span>
      {%- for variant in product.variants -%}
        <button
          type="button"
          class="t-label"
          data-variant-id="{{ variant.id }}"
          {% unless variant.available %}
            disabled
          {% endunless %}
          aria-label="{{ 'products.product.add_variant' | t: product: product.title, variant: variant.title | escape }}"
        >
          {%- if product.has_only_default_variant -%}
            {{- 'products.product.add_to_cart' | t -}}
          {%- else -%}
            {{- variant.title -}}
          {%- endif -%}
        </button>
      {%- endfor -%}
    </quick-add>
  {%- endif -%}
  </div>

  <div class="card__info">
    {%- if product.metafields.kala.drop_code != blank -%}
      <span class="card__index t-label t-label--sm t-muted">{{ product.metafields.kala.drop_code }}</span>
    {%- endif -%}
    <h3 class="card__title">
      <a href="{{ product.url }}">{{ product.title | escape }}</a>
    </h3>
    <span class="card__price">{% render 'price', product: product %}</span>
    {%- if color_option and color_option.values.size > 1 -%}
      <div class="card__meta">
        <ul class="swatches" role="list" aria-label="{{ color_option.name | escape }}">
          {%- for value in color_option.values limit: 5 -%}
            <li class="swatch" style="{% render 'swatch-style', value: value %}" title="{{ value | escape }}"></li>
          {%- endfor -%}
        </ul>
        <span class="t-label t-label--sm t-muted">{{ 'products.product.color_count' | t: count: color_option.values.size }}</span>
      </div>
    {%- endif -%}
  </div>
</article>
`,"/repo/theme/snippets/swatch-style.liquid":`{%- comment -%}
  Outputs \`--swatch: <color|url()>\` for an option or filter value.
  Prefers the swatch configured in Shopify (category metafields / filter
  swatches); falls back to a small map of the colour names this store uses,
  so swatches render even before merchandising has set them up.
{%- endcomment -%}
{%- liquid
  if value.swatch.image
    assign url = value.swatch.image | image_url: width: 64
    echo '--swatch: url(' | append: url | append: ')'
  elsif value.swatch.color
    echo '--swatch: ' | append: value.swatch.color
  else
    assign key = value | downcase | strip
    case key
      when 'bone', 'natural', 'ecru', 'putih tulang'
        echo '--swatch: #E8E1D3'
      when 'ink', 'black', 'hitam'
        echo '--swatch: #26262A'
      when 'clay', 'terracotta', 'bata'
        echo '--swatch: #B5683F'
      when 'olive', 'sage', 'hijau'
        echo '--swatch: #6E7458'
      when 'sand', 'khaki', 'krem'
        echo '--swatch: #C9BB9B'
      when 'navy', 'biru'
        echo '--swatch: #2C3550'
      when 'grey', 'gray', 'abu'
        echo '--swatch: #8E8D88'
      when 'white', 'putih'
        echo '--swatch: #F6F5F1'
    endcase
  endif
-%}
`,"/repo/theme/snippets/theme-tokens.liquid":`{%- comment -%}
  Design tokens that depend on theme settings are emitted inline so they are
  available before base.css arrives. Everything static lives in base.css.

  The fallback face is metric-matched to Archivo so the swap from Arial to the
  web font does not shift layout (keeps CLS at ~0 on slow connections).
{%- endcomment -%}
<style>
  @font-face {
    font-family: 'Archivo';
    src: url('{{ 'archivo-var.woff2' | asset_url }}') format('woff2');
    font-weight: 100 900;
    font-stretch: 62% 125%;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Archivo Fallback';
    src: local('Arial'), local('Helvetica Neue'), local('Helvetica');
    size-adjust: 101%;
    ascent-override: 87%;
    descent-override: 21%;
    line-gap-override: 0%;
  }
  :root {
    --paper: {{ settings.color_paper }};
    --ink: {{ settings.color_ink }};
    --muted: {{ settings.color_muted }};
    --rule: {{ settings.color_rule }};
    --signal: {{ settings.color_signal }};
    --signal-base: {{ settings.color_signal }};
    --paper-rgb: {{ settings.color_paper.red }}, {{ settings.color_paper.green }}, {{ settings.color_paper.blue }};
    --ink-rgb: {{ settings.color_ink.red }}, {{ settings.color_ink.green }}, {{ settings.color_ink.blue }};
    --card-ratio: {{ settings.card_ratio }};
    --logo-width: {{ settings.logo_width }}px;
  }
</style>
`,"/repo/theme/templates/404.json":`{
  "sections": { "main": { "type": "main-404", "settings": {} } },
  "order": ["main"]
}
`,"/repo/theme/templates/article.json":`{
  "sections": { "main": { "type": "main-article", "settings": {} } },
  "order": ["main"]
}
`,"/repo/theme/templates/blog.json":`{
  "sections": { "main": { "type": "main-blog", "settings": {} } },
  "order": ["main"]
}
`,"/repo/theme/templates/cart.json":`{
  "sections": { "main": { "type": "main-cart", "settings": {} } },
  "order": ["main"]
}
`,"/repo/theme/templates/collection.json":`{
  "sections": {
    "main": { "type": "main-collection", "settings": { "per_page": 24, "columns": "3", "show_description": true, "enable_filtering": true, "enable_sorting": true } }
  },
  "order": ["main"]
}
`,"/repo/theme/templates/index.json":`{
  "sections": {
    "hero": {
      "type": "hero-drop",
      "blocks": {
        "spec-1": {
          "type": "spec",
          "settings": {
            "label": "Release",
            "value": "Fri 24.10 \u2014 19:00 WIB"
          }
        },
        "spec-2": {
          "type": "spec",
          "settings": {
            "label": "Pieces",
            "value": "140, numbered"
          }
        },
        "spec-3": {
          "type": "spec",
          "settings": {
            "label": "Cloth",
            "value": "Ramie linen, Majalaya"
          }
        }
      },
      "block_order": [
        "spec-1",
        "spec-2",
        "spec-3"
      ],
      "settings": {
        "image_position": "left",
        "color_scheme": "paper",
        "eyebrow": "Drop 07",
        "eyebrow_right": "Musim kemarau / 2026",
        "title": "Dry\\nSeason\\nUniform",
        "countdown_to": "2026-10-24T19:00:00+07:00",
        "countdown_label": "Opens in",
        "button_label": "View the drop",
        "button_link": "shopify://collections/all",
        "image": "shopify://shop_images/hero-07.png",
        "image_caption": ""
      }
    },
    "featured": {
      "type": "featured-collection",
      "settings": {
        "collection": "drop-07-kemarau",
        "index_label": "01",
        "heading": "Drop 07 \u2014 Kemarau",
        "limit": 8,
        "columns": "4"
      }
    },
    "lookbook": {
      "type": "lookbook",
      "blocks": {
        "pin-1": {
          "type": "hotspot",
          "settings": {
            "product": "jaket-kebun",
            "x": 50,
            "y": 42,
            "note": "Wearing L over a tee"
          }
        },
        "pin-2": {
          "type": "hotspot",
          "settings": {
            "product": "celana-lapangan-drill",
            "x": 87,
            "y": 46,
            "note": "Wearing 30, hem unrolled"
          }
        },
        "pin-3": {
          "type": "hotspot",
          "settings": {
            "product": "topi-lapangan",
            "x": 21,
            "y": 27,
            "note": "One size"
          }
        },
        "pin-4": {
          "type": "hotspot",
          "settings": {
            "product": "tas-sisa-kain",
            "x": 21,
            "y": 72,
            "note": "Pieced offcuts, one of one"
          }
        }
      },
      "block_order": [
        "pin-1",
        "pin-2",
        "pin-3",
        "pin-4"
      ],
      "settings": {
        "index_label": "02",
        "heading": "Worn: Pasar Cihapit, 07:40",
        "button_label": "Shop the look",
        "button_link": "shopify://collections/all",
        "image": "shopify://shop_images/look-07.png"
      }
    },
    "notes": {
      "type": "production-notes",
      "blocks": {
        "r1": {
          "type": "row",
          "settings": {
            "label": "Cloth",
            "value": "Ramie linen, 180 gsm, woven in Majalaya"
          }
        },
        "r2": {
          "type": "row",
          "settings": {
            "label": "Workshop",
            "value": "Cigadung, Bandung \u2014 6 tailors"
          }
        },
        "r3": {
          "type": "row",
          "settings": {
            "label": "Lead time",
            "value": "21 days from cut to fold"
          }
        },
        "r4": {
          "type": "row",
          "settings": {
            "label": "Run",
            "value": "140 pieces across 12 styles"
          }
        }
      },
      "block_order": [
        "r1",
        "r2",
        "r3",
        "r4"
      ],
      "settings": {
        "color_scheme": "ink"
      }
    },
    "archive": {
      "type": "collection-index",
      "blocks": {
        "d7": {
          "type": "drop",
          "settings": {
            "collection": "drop-07-kemarau",
            "number": "07",
            "fallback_title": "Kemarau",
            "season": "Dry season 2026",
            "upcoming": true
          }
        },
        "d6": {
          "type": "drop",
          "settings": {
            "collection": "drop-06-pancaroba",
            "number": "06",
            "fallback_title": "Pancaroba",
            "season": "Transition 2026"
          }
        },
        "d5": {
          "type": "drop",
          "settings": {
            "collection": "drop-05-hujan",
            "number": "05",
            "fallback_title": "Hujan",
            "season": "Wet season 2025"
          }
        }
      },
      "block_order": [
        "d7",
        "d6",
        "d5"
      ],
      "settings": {
        "index_label": "04",
        "heading": "Archive"
      }
    }
  },
  "order": [
    "hero",
    "featured",
    "lookbook",
    "notes",
    "archive"
  ]
}`,"/repo/theme/templates/list-collections.json":`{
  "sections": { "main": { "type": "main-list-collections", "settings": {} } },
  "order": ["main"]
}
`,"/repo/theme/templates/page.json":`{
  "sections": { "main": { "type": "main-page", "settings": {} } },
  "order": ["main"]
}
`,"/repo/theme/templates/password.json":`{
  "sections": { "main": { "type": "main-password", "settings": {} } },
  "order": ["main"],"layout":"password"
}
`,"/repo/theme/templates/product.json":`{
  "sections": {
    "main": {
      "type": "main-product",
      "blocks": {
        "title": { "type": "title", "settings": {} },
        "price": { "type": "price", "settings": {} },
        "picker": { "type": "variant_picker", "settings": {} },
        "fit": { "type": "fit_note", "settings": { "fallback": "" } },
        "buy": { "type": "buy_buttons", "settings": { "show_dynamic_checkout": false } },
        "desc": { "type": "description", "settings": { "open": true } },
        "details": { "type": "details", "settings": {} },
        "shipping": {
          "type": "collapsible",
          "settings": {
            "heading": "Shipping & returns",
            "content": "<p>Ships from Bandung in 1\u20132 working days. Free shipping in Indonesia over Rp 750.000. Exchanges within 14 days for unworn pieces; drops are not restocked, so exchanges depend on what is left.</p>"
          }
        }
      },
      "block_order": ["title", "price", "picker", "fit", "buy", "desc", "details", "shipping"],
      "settings": {}
    },
    "recs": {
      "type": "product-recommendations",
      "settings": { "index_label": "\u2014", "heading": "Wear it with", "intent": "related", "limit": 4 }
    }
  },
  "order": ["main", "recs"]
}
`,"/repo/theme/templates/search.json":`{
  "sections": { "main": { "type": "main-search", "settings": {} } },
  "order": ["main"]
}
`,"/repo/ops/src/seed/catalog.json":`{
  "collections": [
    {
      "handle": "drop-07-kemarau",
      "title": "Drop 07 \u2014 Kemarau",
      "description": "<p>Twelve pieces in undyed ramie and washed cotton drill, cut for 34\xB0 afternoons. Made once, in a run of 140.</p>",
      "image": "knolling-07.png"
    },
    {
      "handle": "drop-06-pancaroba",
      "title": "Drop 06 \u2014 Pancaroba",
      "description": "<p>Layers for the weeks when the weather can't decide. Sold through in nine days.</p>",
      "image": "knolling-06.png"
    },
    {
      "handle": "drop-05-hujan",
      "title": "Drop 05 \u2014 Hujan",
      "description": "<p>Waxed cotton and quick-dry nylon for the wet season. Archived.</p>",
      "image": "knolling-05.png"
    }
  ],
  "sizeCharts": {
    "tops": {
      "unit": "cm",
      "columns": ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
      "rows": [
        ["S", "108", "70", "50", "23"],
        ["M", "114", "72", "52", "24"],
        ["L", "120", "74", "54", "25"],
        ["XL", "126", "76", "56", "26"]
      ],
      "note": "Measured flat, doubled for chest. Boxy cut \u2014 take your usual size."
    },
    "bottoms": {
      "unit": "cm",
      "columns": ["Size", "Waist", "Hip", "Rise", "Inseam", "Hem"],
      "rows": [
        ["28", "74", "104", "30", "74", "21"],
        ["30", "79", "108", "31", "75", "21.5"],
        ["32", "84", "112", "32", "76", "22"],
        ["34", "89", "116", "33", "77", "22.5"],
        ["36", "94", "120", "34", "78", "23"]
      ],
      "note": "Wide, straight leg. Waistband has a half-elastic back for heat and rice."
    }
  },
  "products": [
    {
      "handle": "kemeja-kerja-ramie",
      "title": "Kemeja Kerja Ramie",
      "collection": "drop-07-kemarau",
      "type": "Shirt",
      "drop_code": "07.01",
      "price": 489000,
      "garment": "shirt",
      "color": "#D9CDB4",
      "options": { "Size": ["S", "M", "L", "XL"] },
      "stock": { "S": 6, "M": 3, "L": 9, "XL": 4 },
      "weight": 0.32,
      "sizeChart": "tops",
      "fit_note": "Boxy through the body, dropped shoulder. Take your usual size; size down for a closer fit.",
      "material": "100% ramie linen, 180 gsm, undyed",
      "care": "Cold wash, line dry in shade. Wrinkles are the point.",
      "origin": "Cut and sewn in Cigadung, Bandung",
      "description": "<p>A work shirt in undyed ramie, a bast fibre that dries faster than linen and softens with every wash. Two chest pockets sized for a phone and a notebook, a back yoke with a single box pleat, and corozo buttons.</p>",
      "pairs": ["celana-lapangan-drill", "topi-lapangan"]
    },
    {
      "handle": "celana-lapangan-drill",
      "title": "Celana Lapangan Drill",
      "collection": "drop-07-kemarau",
      "type": "Trousers",
      "drop_code": "07.02",
      "price": 549000,
      "garment": "trousers",
      "color": "#8C8467",
      "options": { "Size": ["28", "30", "32", "34", "36"] },
      "stock": { "28": 2, "30": 7, "32": 8, "34": 5, "36": 0 },
      "weight": 0.55,
      "sizeChart": "bottoms",
      "fit_note": "Wide, straight leg with a mid rise. True to waist size.",
      "material": "100% cotton drill, 280 gsm, garment washed",
      "care": "Machine wash 30\xB0. Tumble low.",
      "origin": "Cut and sewn in Cigadung, Bandung",
      "description": "<p>Field trousers in washed cotton drill. Half-elastic back waist, deep front pockets, a hammer loop that holds an umbrella, and a hem that sits clean over sandals.</p>",
      "pairs": ["kemeja-kerja-ramie", "kaos-berat-240"]
    },
    {
      "handle": "kaos-berat-240",
      "title": "Kaos Berat 240",
      "collection": "drop-07-kemarau",
      "type": "T-shirt",
      "drop_code": "07.03",
      "price": 229000,
      "garment": "tee",
      "colors": { "Bone": "#E8E1D3", "Ink": "#26262A", "Clay": "#B5683F" },
      "options": { "Color": ["Bone", "Ink", "Clay"], "Size": ["S", "M", "L", "XL"] },
      "stockDefault": 6,
      "stockOverrides": { "Clay / S": 0, "Ink / XL": 2 },
      "weight": 0.26,
      "sizeChart": "tops",
      "fit_note": "Relaxed, slightly cropped. Collar won't bacon.",
      "material": "100% combed cotton, 240 gsm, open-end jersey",
      "care": "Wash inside out, cold.",
      "origin": "Knit in Majalaya, sewn in Bandung",
      "description": "<p>A heavyweight tee with a 2 cm rib collar, twin-needle hems and side seams. Dense enough to wear alone at noon.</p>",
      "pairs": ["celana-pendek-drill"]
    },
    {
      "handle": "jaket-kebun",
      "title": "Jaket Kebun",
      "collection": "drop-07-kemarau",
      "type": "Jacket",
      "drop_code": "07.04",
      "price": 789000,
      "garment": "jacket",
      "color": "#5E6B52",
      "options": { "Size": ["M", "L", "XL"] },
      "stock": { "M": 1, "L": 2, "XL": 1 },
      "weight": 0.7,
      "sizeChart": "tops",
      "fit_note": "Cut to layer over a shirt. Size down if wearing over a tee.",
      "material": "Cotton\u2013ramie canvas, 340 gsm",
      "care": "Cold wash. Will fade unevenly, on purpose.",
      "origin": "Cut and sewn in Cigadung, Bandung",
      "description": "<p>A chore jacket in dense cotton\u2013ramie canvas. Three patch pockets, a hidden inside pocket, and triple-stitched seams.</p>",
      "pairs": ["kemeja-kerja-ramie", "celana-lapangan-drill"]
    },
    {
      "handle": "topi-lapangan",
      "title": "Topi Lapangan",
      "collection": "drop-07-kemarau",
      "type": "Hat",
      "drop_code": "07.05",
      "price": 189000,
      "garment": "cap",
      "color": "#C9BB9B",
      "options": {},
      "stock": { "Default Title": 18 },
      "weight": 0.1,
      "material": "Ramie linen with cotton sweatband",
      "care": "Hand wash, reshape, dry flat.",
      "origin": "Sewn in Bandung",
      "description": "<p>A six-panel field cap with a soft unstructured crown and a short brim. Brass slider at the back.</p>"
    },
    {
      "handle": "tas-sisa-kain",
      "title": "Tas Sisa Kain",
      "collection": "drop-07-kemarau",
      "type": "Bag",
      "drop_code": "07.06",
      "price": 149000,
      "compareAt": 199000,
      "garment": "tote",
      "color": "#D9CDB4",
      "options": {},
      "stock": { "Default Title": 24 },
      "weight": 0.18,
      "material": "Offcuts from Drop 07, pieced",
      "care": "Cold wash.",
      "origin": "Sewn in Bandung",
      "description": "<p>Pieced from the offcuts of this drop, so no two match. Ships free with any order over Rp 750.000.</p>"
    },
    {
      "handle": "kemeja-pendek-ramie",
      "title": "Kemeja Pendek Ramie",
      "collection": "drop-07-kemarau",
      "type": "Shirt",
      "drop_code": "07.07",
      "price": 429000,
      "garment": "shortshirt",
      "color": "#EDE6D6",
      "options": { "Size": ["S", "M", "L", "XL"] },
      "stock": { "S": 0, "M": 5, "L": 4, "XL": 2 },
      "weight": 0.27,
      "sizeChart": "tops",
      "fit_note": "Camp collar, straight hem worn out. Take your usual size.",
      "material": "100% ramie linen, 160 gsm",
      "care": "Cold wash, line dry.",
      "origin": "Cut and sewn in Cigadung, Bandung",
      "description": "<p>The short-sleeve version, with a camp collar and a single chest pocket.</p>",
      "pairs": ["celana-pendek-drill"]
    },
    {
      "handle": "celana-pendek-drill",
      "title": "Celana Pendek Drill",
      "collection": "drop-07-kemarau",
      "type": "Shorts",
      "drop_code": "07.08",
      "price": 349000,
      "garment": "shorts",
      "color": "#A39A7E",
      "options": { "Size": ["28", "30", "32", "34"] },
      "stock": { "28": 4, "30": 6, "32": 6, "34": 3 },
      "weight": 0.35,
      "sizeChart": "bottoms",
      "fit_note": "Above the knee, wide leg.",
      "material": "100% cotton drill, 280 gsm",
      "care": "Machine wash 30\xB0.",
      "origin": "Cut and sewn in Cigadung, Bandung",
      "description": "<p>The field trouser, cut off at an 18 cm inseam.</p>"
    },
    {
      "handle": "overshirt-pancaroba",
      "title": "Overshirt Pancaroba",
      "collection": "drop-06-pancaroba",
      "type": "Shirt",
      "drop_code": "06.01",
      "price": 619000,
      "garment": "jacket",
      "color": "#7A5A3E",
      "options": { "Size": ["S", "M", "L", "XL"] },
      "stock": { "S": 0, "M": 0, "L": 0, "XL": 0 },
      "weight": 0.5,
      "sizeChart": "tops",
      "material": "Brushed cotton twill",
      "description": "<p>From Drop 06. Sold out.</p>"
    },
    {
      "handle": "celana-lebar-pancaroba",
      "title": "Celana Lebar Pancaroba",
      "collection": "drop-06-pancaroba",
      "type": "Trousers",
      "drop_code": "06.02",
      "price": 529000,
      "garment": "trousers",
      "color": "#3F4248",
      "options": { "Size": ["28", "30", "32", "34"] },
      "stock": { "28": 0, "30": 0, "32": 0, "34": 0 },
      "weight": 0.55,
      "sizeChart": "bottoms",
      "material": "Cotton\u2013nylon ripstop",
      "description": "<p>From Drop 06. Sold out.</p>"
    },
    {
      "handle": "parka-hujan",
      "title": "Parka Hujan",
      "collection": "drop-05-hujan",
      "type": "Jacket",
      "drop_code": "05.01",
      "price": 949000,
      "garment": "jacket",
      "color": "#2F3A35",
      "options": { "Size": ["M", "L", "XL"] },
      "stock": { "M": 0, "L": 0, "XL": 0 },
      "weight": 0.8,
      "sizeChart": "tops",
      "material": "Waxed cotton",
      "description": "<p>From Drop 05. Archived.</p>"
    }
  ]
}
`,"/repo/design/out/celana-lapangan-drill-back.png":"","/repo/design/out/celana-lapangan-drill-detail.png":"","/repo/design/out/celana-lapangan-drill-front.png":"","/repo/design/out/celana-lebar-pancaroba-back.png":"","/repo/design/out/celana-lebar-pancaroba-detail.png":"","/repo/design/out/celana-lebar-pancaroba-front.png":"","/repo/design/out/celana-pendek-drill-back.png":"","/repo/design/out/celana-pendek-drill-detail.png":"","/repo/design/out/celana-pendek-drill-front.png":"","/repo/design/out/hero-07.png":"","/repo/design/out/jaket-kebun-back.png":"","/repo/design/out/jaket-kebun-detail.png":"","/repo/design/out/jaket-kebun-front.png":"","/repo/design/out/kaos-berat-240-back.png":"","/repo/design/out/kaos-berat-240-detail.png":"","/repo/design/out/kaos-berat-240-front-clay.png":"","/repo/design/out/kaos-berat-240-front-ink.png":"","/repo/design/out/kaos-berat-240-front.png":"","/repo/design/out/kemeja-kerja-ramie-back.png":"","/repo/design/out/kemeja-kerja-ramie-detail.png":"","/repo/design/out/kemeja-kerja-ramie-front.png":"","/repo/design/out/kemeja-pendek-ramie-back.png":"","/repo/design/out/kemeja-pendek-ramie-detail.png":"","/repo/design/out/kemeja-pendek-ramie-front.png":"","/repo/design/out/knolling-05.png":"","/repo/design/out/knolling-06.png":"","/repo/design/out/knolling-07.png":"","/repo/design/out/look-07.png":"","/repo/design/out/overshirt-pancaroba-back.png":"","/repo/design/out/overshirt-pancaroba-detail.png":"","/repo/design/out/overshirt-pancaroba-front.png":"","/repo/design/out/parka-hujan-back.png":"","/repo/design/out/parka-hujan-detail.png":"","/repo/design/out/parka-hujan-front.png":"","/repo/design/out/tas-sisa-kain-back.png":"","/repo/design/out/tas-sisa-kain-detail.png":"","/repo/design/out/tas-sisa-kain-front.png":"","/repo/design/out/topi-lapangan-back.png":"","/repo/design/out/topi-lapangan-detail.png":"","/repo/design/out/topi-lapangan-front.png":""};var be=te,Mn=t=>t instanceof URL?t.pathname:String(t).replace(/^file:\/\//,""),Ae=t=>{let e=Mn(t);if(!(e in be)){let n=new Error(`ENOENT: ${e}`);throw n.code="ENOENT",n}return be[e]},ce=t=>Ae(t),ye=t=>Mn(t)in be,Re=async t=>Ae(t),En=t=>(String(t).match(/\.[^./]*$/)||[""])[0];var gt=null,Pn=t=>(gt=t,{listen:()=>{}});globalThis.process??={env:{}};globalThis.Buffer??={concat:t=>{let e=new Uint8Array(t.reduce((i,s)=>i+s.length,0)),n=0;for(let i of t)e.set(i,n),n+=i.length;return{toString:()=>new TextDecoder().decode(e)}}};var Dn={sep:"/",dirname:t=>t.replace(/\/[^/]*$/,""),resolve:(t,e,n)=>{let i=e.endsWith(n)?e:e+n;return i.startsWith("/")?i:`${t.replace(/\/$/,"")}/${i}`},contains:(t,e)=>e.startsWith(t),exists:async t=>t in be,existsSync:t=>t in be,readFile:async t=>Ae(t),readFileSync:t=>Ae(t)};var C=class{constructor(e,n,i,s,a){this.kind=e,this.input=n,this.begin=i,this.end=s,this.file=a}getText(){return this.input.slice(this.begin,this.end)}getPosition(){let[e,n]=[1,1];for(let i=0;i<this.begin;i++)this.input[i]===`
`?(e++,n=1):n++;return[e,n]}size(){return this.end-this.begin}},q=class{liquidMethodMissing(e,n){}},Ki=Object.prototype.toString,$n=String.prototype.toLowerCase,nt=Object.hasOwnProperty;function g(t){return typeof t=="string"}function S(t){return typeof t=="function"}function Xi(t){return t&&S(t.then)}function $e(t){return t&&S(t.next)&&S(t.throw)&&S(t.return)}function u(t){return t=m(t),g(t)?t:x(t)?"":T(t)?t.map(e=>u(e)).join(""):String(t)}function Oe(t,e,n){if(e<0&&(e=t.length+e),!(n&&!nt.call(t,e)))return t[e]}function qe(t){return t=m(t),T(t)?t:g(t)&&t.length>0?[t]:Qi(t)?Array.from(t):it(t)?Object.keys(t).map(e=>[e,t[e]]):[]}function L(t){return t=m(t),x(t)?[]:T(t)?t:[t]}function m(t){return t instanceof q&&S(t.valueOf)?t.valueOf():t}function bt(t){return+m(t)||0}function Fe(t){return typeof t=="number"}function oi(t){return t&&S(t.toLiquid)?oi(t.toLiquid()):t}function x(t){return t==null}function Zi(t){return t===void 0}function T(t){return Ki.call(t)==="[object Array]"}function li(t){return t&&Fe(t.length)}function Qi(t){return it(t)&&Symbol.iterator in t}function Nn(t,e){t=t||{};for(let n in t)if(nt.call(t,n)&&e(t[n],n,t)===!1)break;return t}function es(t){return t[t.length-1]}function it(t){let e=typeof t;return t!==null&&(e==="object"||e==="function")}function ci(t,e,n=1){let i=[];for(let s=t;s<e;s+=n)i.push(s);return i}function ue(t,e,n=" "){return di(t,e,n,(i,s)=>s+i)}function ts(t,e,n=" "){return di(t,e,n,(i,s)=>i+s)}function di(t,e,n,i){t=String(t);let s=e-t.length;return s<=0?t:i(t,n.repeat(s))}function ui(t){return t}function ns(t){return[...t].some(n=>n>="a"&&n<="z")?t.toUpperCase():t.toLowerCase()}function is(t,e){return t.length>e?t.slice(0,e-3)+"...":t}function ss(t,e){return x(t)&&x(e)?0:x(t)?1:x(e)||t<e?-1:t>e?1:0}function as(t,e){return x(t)&&x(e)?0:x(t)?1:x(e)||(t=$n.call(t),e=$n.call(e),t<e)?-1:t>e?1:0}function st(t){return function(...e){return t.call(this,...e.map(m))}}function N(t){return function(...e){return t.call(this,...e.map(bt))}}function*Me(t){let e=new Set;for(let n of t){let i=JSON.stringify(n);e.has(i)||(e.add(i),yield n)}}var Bn="__liquidClass__",U=class extends Error{constructor(e,n){super(typeof e=="string"?e:e.message),this.context="",typeof e!="string"&&Object.defineProperty(this,"originalError",{value:e,enumerable:!1}),Object.defineProperty(this,"token",{value:n,enumerable:!1}),Object.defineProperty(this,Bn,{value:"LiquidError",enumerable:!1})}update(){Object.defineProperty(this,"context",{value:rs(this.token),enumerable:!1}),this.message=os(this.message,this.token),this.stack=this.message+`
`+this.context+`
`+this.stack,this.originalError&&(this.stack+=`
From `+this.originalError.stack)}static is(e){return e?.[Bn]==="LiquidError"}},yt=class extends U{constructor(e,n){super(e,n),this.name="TokenizationError",super.update()}},vt=class extends U{constructor(e,n){super(e,n),this.name="ParseError",this.message=e.message,super.update()}},wt=class extends U{constructor(e,n){super(e,n.token),this.name="RenderError",this.message=e.message,super.update()}static is(e){return e.name==="RenderError"}},Ne=class extends U{constructor(e){super(e[0],e[0].token),this.errors=e,this.name="LiquidErrors";let n=e.length>1?"s":"";this.message=`${e.length} error${n} found`,super.update()}static is(e){return e.name==="LiquidErrors"}},kt=class extends U{constructor(e,n){super(e,n),this.name="UndefinedVariableError",this.message=e.message,super.update()}},xt=class extends Error{constructor(e){super(`undefined variable: ${e}`),this.name="InternalUndefinedVariableError",this.variableName=e}},St=class extends Error{constructor(e){super(e),this.name="AssertionError",this.message=e+""}};function rs(t){let[e,n]=t.getPosition(),i=t.input.split(`
`),s=Math.max(e-2,1),a=Math.min(e+3,i.length);return ci(s,a+1).map(o=>{let l=o===e?">> ":"   ",c=ue(String(o),String(a).length),d=`${l}${c}| `,p=o===e?`
`+ue("^",n+d.length):"";return d+=i[o-1],d+=p,d}).join(`
`)}function os(t,e){e.file&&(t+=`, file:${e.file}`);let[n,i]=e.getPosition();return t+=`, line:${n}, col:${i}`,t}var y=[0,0,0,0,0,0,0,0,0,20,4,4,4,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,2,8,0,0,0,0,8,0,0,0,64,0,65,0,0,33,33,33,33,33,33,33,33,33,33,0,0,2,2,2,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],ls=1,pe=4,In=8,pi=16,cs=32,ds=64,us=128;function Ee(t){let e=t.charCodeAt(0);return e>=128?!y[e]:!!(y[e]&ls)}y[160]=y[5760]=y[6158]=y[8192]=y[8193]=y[8194]=y[8195]=y[8196]=y[8197]=y[8198]=y[8199]=y[8200]=y[8201]=y[8202]=y[8232]=y[8233]=y[8239]=y[8287]=y[12288]=pe;y[8220]=y[8221]=us;function z(t,e){if(!t){let n=typeof e=="function"?e():e||`expect ${t} to be true`;throw new St(n)}}function Be(t,e=`unexpected ${JSON.stringify(t)}`){z(!t,e)}var Tt=class extends q{*equals(e){return x(yield m(e))}gt(){return!1}geq(){return!1}lt(){return!1}leq(){return!1}valueOf(){return null}},xe=class t extends q{*equals(e){return e instanceof t?!1:(e=yield m(e),g(e)||T(e)?e.length===0:it(e)?Object.keys(e).length===0:!1)}gt(){return!1}geq(){return!1}lt(){return!1}leq(){return!1}valueOf(){return""}static is(e){return e instanceof t}},zt=class t extends xe{*equals(e){return e===!1||x(yield m(e))?!0:g(e)?/^\s*$/.test(e):yield super.equals(e)}static is(e){return e instanceof t}},Se=class extends q{constructor(e,n,i){super(),this.i=0,this.length=e,this.name=`${i}-${n}`}next(){this.i++}index0(){return this.i}index(){return this.i+1}first(){return this.i===0}last(){return this.i===this.length-1}rindex(){return this.length-this.i}rindex0(){return this.length-this.i-1}valueOf(){return JSON.stringify(this)}},Ie=class{constructor(){this.buffer=""}write(e){this.buffer+=u(e)}},jt=class{constructor(){throw this.buffer="",this.stream=null,new Error("streaming not supported in browser")}},Lt=class{constructor(){this.buffer=""}write(e){e=m(e),typeof e!="string"&&this.buffer===""?this.buffer=e:this.buffer=u(this.buffer)+u(e)}},Ve=class extends q{constructor(e=()=>""){super(),this.superBlockRender=e}*super(){let e=new Ie;return yield this.superBlockRender(e),e.buffer}};function $(t){return t&&S(t.equals)&&S(t.gt)&&S(t.geq)&&S(t.lt)&&S(t.leq)}var Vn=new Tt,hi={true:!0,false:!1,nil:Vn,null:Vn,empty:new xe,blank:new zt},Hn=new WeakMap;function Un(t){let e=Hn.get(t);if(e)return e;let n={};for(let[i,s]of Object.entries(t)){let a=n;for(let r=0;r<i.length;r++){let o=i[r];a[o]=a[o]||{},r===i.length-1&&Ee(i[r])&&(a[o].needBoundary=!0),a=a[o]}a.data=s,a.end=!0}return Hn.set(t,n),n}var He=function(){return He=Object.assign||function(e){for(var n,i=1,s=arguments.length;i<s;i++){n=arguments[i];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},He.apply(this,arguments)};function w(t,e,n,i){function s(a){return a instanceof n?a:new n(function(r){r(a)})}return new(n||(n=Promise))(function(a,r){function o(d){try{c(i.next(d))}catch(p){r(p)}}function l(d){try{c(i.throw(d))}catch(p){r(p)}}function c(d){d.done?a(d.value):s(d.value).then(o,l)}c((i=i.apply(t,e||[])).next())})}function Ot(t,e){let n=e||t;return(i,...s)=>i?n(...s):t(...s)}function I(t){return w(this,void 0,void 0,function*(){if(!$e(t))return t;let e,n=!1,i="next";do{let s=t[i](e);n=!!s.done,e=s.value,i="next";try{$e(e)&&(e=I(e)),Xi(e)&&(e=yield e)}catch(a){i="throw",e=a}}while(!n);return e})}function V(t){if(!$e(t))return t;let e,n=!1,i="next";do{let s=t[i](e);if(n=!!s.done,e=s.value,i="next",$e(e))try{e=V(e)}catch(a){i="throw",e=a}}while(!n);return e}var ps=/%([-_0^#:]+)?(\d+)?([EO])?(.)/;function hs(t){return[31,fs(t)?29:28,31,30,31,30,31,31,30,31,30,31]}function fi(t){let e=0;for(let n=0;n<t.getMonth();++n)e+=hs(t)[n];return e+t.getDate()}function Wn(t,e){let n=(t.getDay()-e+7)%7;return String(Math.floor((fi(t)-1-n+7)/7))}function fs(t){let e=t.getFullYear();return!!((e&3)===0&&(e%100||e%400===0&&e))}function ms(t){let e=t.getDate();if([11,12,13].includes(e))return"th";switch(e%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}}function gs(t){return Math.floor(t.getFullYear()/100)}var _s={C:2,d:2,e:2,H:2,I:2,j:3,k:2,l:2,L:3,m:2,M:2,S:2,U:2,W:2,y:2},bs=new Set("aAbBceklpP");function Jn(t,e){let n=Math.abs(t.getTimezoneOffset()),i=Math.floor(n/60),s=n%60;return(t.getTimezoneOffset()>0?"-":"+")+ue(i,2,"0")+(e.flags[":"]?":":"")+ue(s,2,"0")}var qt={a:t=>t.getShortWeekdayName(),A:t=>t.getLongWeekdayName(),b:t=>t.getShortMonthName(),B:t=>t.getLongMonthName(),c:t=>t.toLocaleString(),C:t=>gs(t),d:t=>t.getDate(),e:t=>t.getDate(),H:t=>t.getHours(),I:t=>String(t.getHours()%12||12),j:t=>fi(t),k:t=>t.getHours(),l:t=>String(t.getHours()%12||12),L:t=>t.getMilliseconds(),m:t=>t.getMonth()+1,M:t=>t.getMinutes(),N:(t,e)=>{var n;let i=Number(e.width)||9,s=ue(String(t.getMilliseconds()),3,"0").slice(0,i);return(n=e.memoryLimit)===null||n===void 0||n.use(i-s.length),ts(s,i,"0")},p:t=>t.getHours()<12?"AM":"PM",P:t=>t.getHours()<12?"am":"pm",q:t=>ms(t),s:t=>Math.floor(t.dateValue()/1e3),S:t=>t.getSeconds(),u:t=>t.getDay()||7,U:t=>Wn(t,0),w:t=>t.getDay(),W:t=>Wn(t,1),x:t=>t.toLocaleDateString(),X:t=>t.toLocaleTimeString(),y:t=>(t.getFullYear()%100+100)%100,Y:t=>t.getFullYear(),z:Jn,Z:(t,e)=>t.getTimeZoneName()||Jn(t,e),t:()=>"	",n:()=>`
`,"%":()=>"%"};qt.h=qt.b;function Pe(t,e,n){let i="",s=e,a;for(;a=ps.exec(s);)i+=s.slice(0,a.index),s=s.slice(a.index+a[0].length),i+=ys(t,a,n);return i+s}function ys(t,e,n){let[i,s="",a,r,o]=e,l=qt[o];if(!l)return i;let c={};for(let _ of s)c[_]=!0;let d=String(l(t,{flags:c,width:a,modifier:r,memoryLimit:n})),p=bs.has(o)?" ":"0",h=Number(a)||_s[o]||0;return c["^"]?d=d.toUpperCase():c["#"]&&(d=ns(d)),c._?p=" ":c[0]&&(p="0"),c["-"]&&(h=0),n?.use(Number(h)-d.length),ue(d,h,p)}function mi(){return typeof Intl<"u"?Intl.DateTimeFormat:void 0}var vs=6e4,ws=/([zZ]|([+-])(\d{2}):?(\d{2}))$/,gi=["January","February","March","April","May","June","July","August","September","October","November","December"],ks=gi.map(t=>t.slice(0,3)),_i=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],xs=_i.map(t=>t.slice(0,3)),G=class t{constructor(e,n,i){this.locale=n,this.DateTimeFormat=mi(),this.date=new Date(e),this.timezoneFixed=i!==void 0,i===void 0&&(i=this.date.getTimezoneOffset()),this.timezoneOffset=g(i)?t.getTimezoneOffset(i,this.date):i,this.timezoneName=g(i)?i:"";let s=(this.date.getTimezoneOffset()-this.timezoneOffset)*vs,a=this.date.getTime()+s;this.displayDate=new Date(a)}getTime(){return this.displayDate.getTime()}dateValue(){return this.date.getTime()}getMilliseconds(){return this.displayDate.getMilliseconds()}getSeconds(){return this.displayDate.getSeconds()}getMinutes(){return this.displayDate.getMinutes()}getHours(){return this.displayDate.getHours()}getDay(){return this.displayDate.getDay()}getDate(){return this.displayDate.getDate()}getMonth(){return this.displayDate.getMonth()}getFullYear(){return this.displayDate.getFullYear()}toLocaleString(e,n){return n?.timeZone?this.date.toLocaleString(e,n):this.displayDate.toLocaleString(e,n)}toLocaleTimeString(e){return this.displayDate.toLocaleTimeString(e)}toLocaleDateString(e){return this.displayDate.toLocaleDateString(e)}getTimezoneOffset(){return this.timezoneOffset}getTimeZoneName(){if(this.timezoneFixed)return this.timezoneName;if(this.DateTimeFormat)return this.DateTimeFormat().resolvedOptions().timeZone}getLongMonthName(){var e;return(e=this.format({month:"long"}))!==null&&e!==void 0?e:gi[this.getMonth()]}getShortMonthName(){var e;return(e=this.format({month:"short"}))!==null&&e!==void 0?e:ks[this.getMonth()]}getLongWeekdayName(){var e;return(e=this.format({weekday:"long"}))!==null&&e!==void 0?e:_i[this.displayDate.getDay()]}getShortWeekdayName(){var e;return(e=this.format({weekday:"short"}))!==null&&e!==void 0?e:xs[this.displayDate.getDay()]}valid(){return!isNaN(this.getTime())}format(e){return this.DateTimeFormat&&this.DateTimeFormat(this.locale,e).format(this.displayDate)}static createDateFixedToTimezone(e,n){let i=e.match(ws);if(i&&i[1]==="Z")return new t(+new Date(e),n,0);if(i&&i[2]&&i[3]&&i[4]){let[,,s,a,r]=i,o=(s==="+"?-1:1)*(parseInt(a,10)*60+parseInt(r,10));return new t(+new Date(e),n,o)}return new t(e,n)}static getTimezoneOffset(e,n){let i=n.toLocaleString("en-US",{timeZone:e}),s=n.toLocaleString("en-US",{timeZone:"UTC"}),a=new Date(i);return(+new Date(s)-+a)/(60*1e3)}},Te=class{constructor(e,n){this.base=0,this.message=`${e} limit exceeded`,this.limit=n}use(e){+e>0&&(z(this.base+ +e<=this.limit,this.message),this.base+=+e)}check(e){+e>0&&z(+e<=this.limit,this.message)}},ze=class extends C{constructor(e,[n,i],s,a,r,o,l,c){super(e,s,a,r,c),this.trimLeft=!1,this.trimRight=!1;let d=s[n]==="-",p=s[i-1]==="-",h=d?n+1:n,_=p?i-1:i;for(;h<_&&y[s.charCodeAt(h)]&pe;)h++;for(;_>h&&y[s.charCodeAt(_-1)]&pe;)_--;this.contentRange=[h,_],this.trimLeft=d||o,this.trimRight=p||l}get content(){return this.input.slice(this.contentRange[0],this.contentRange[1])}},Ue=class extends ze{constructor(e,n,i,s,a){let{trimTagLeft:r,trimTagRight:o,tagDelimiterLeft:l,tagDelimiterRight:c}=s,[d,p]=[n+l.length,i-c.length];super(v.Tag,[d,p],e,n,i,r,o,a),this.tokenizer=new R(e,s.operators,a,this.contentRange,s.groupedExpressions),this.name=this.tokenizer.readTagName(),this.tokenizer.assert(this.name,"illegal tag syntax, tag name expected"),this.tokenizer.skipBlank(),this.args=this.tokenizer.input.slice(this.tokenizer.p,this.contentRange[1])}},Ft=class extends ze{constructor(e,n,i,s,a){let{trimOutputLeft:r,trimOutputRight:o,outputDelimiterLeft:l,outputDelimiterRight:c}=s,d=[n+l.length,i-c.length];super(v.Output,d,e,n,i,r,o,a)}},We=class extends C{constructor(e,n,i,s){super(v.HTML,e,n,i,s),this.input=e,this.begin=n,this.end=i,this.file=s,this.trimLeft=0,this.trimRight=0}getContent(){return this.input.slice(this.begin+this.trimLeft,this.end-this.trimRight)}},Ct=class extends C{constructor(e,n,i,s){super(v.Number,e,n,i,s),this.input=e,this.begin=n,this.end=i,this.file=s,this.content=Number(this.getText())}},ve=class extends C{constructor(e,n,i,s){super(v.Word,e,n,i,s),this.input=e,this.begin=n,this.end=i,this.file=s,this.content=this.getText()}},At=class extends C{constructor(e,n,i,s){super(v.Literal,e,n,i,s),this.input=e,this.begin=n,this.end=i,this.file=s,this.literal=this.getText(),this.content=hi[this.literal]}},Yn={"==":2,"!=":2,">":2,"<":2,">=":2,"<=":2,contains:2,not:1,and:0,or:0},Ss={"==":0,"!=":0,">":0,"<":0,">=":0,"<=":0,contains:0,not:1,and:0,or:0},Rt=class extends C{constructor(e,n,i,s){super(v.Operator,e,n,i,s),this.input=e,this.begin=n,this.end=i,this.file=s,this.operator=this.getText()}getPrecedence(){return this.operator in Yn?Yn[this.operator]:1}},Je=class extends C{constructor(e,n,i,s,a,r){super(v.PropertyAccess,i,s,a,r),this.variable=e,this.props=n}},Ye=class extends C{constructor(e,n,i,s,a,r){super(v.Filter,i,s,a,r),this.name=e,this.args=n}},Mt=class extends C{constructor(e,n,i,s,a,r){super(v.Hash,e,n,i,r),this.input=e,this.begin=n,this.end=i,this.name=s,this.value=a,this.file=r}},Ts=/[\da-fA-F]/,Gn=/[0-7]/,Kn={b:"\b",f:"\f",n:`
`,r:"\r",t:"	",v:"\v"};function Xn(t){let e=t.charCodeAt(0);return e>=97?e-87:e>=65?e-55:e-48}function zs(t){let e="";for(let n=1;n<t.length-1;n++){if(t[n]!=="\\"){e+=t[n];continue}if(Kn[t[n+1]]!==void 0)e+=Kn[t[++n]];else if(t[n+1]==="u"){let i=0,s=n+2;for(;s<=n+5&&Ts.test(t[s]);)i=i*16+Xn(t[s++]);n=s-1,e+=String.fromCharCode(i)}else if(!Gn.test(t[n+1]))e+=t[++n];else{let i=n+1,s=0;for(;i<=n+3&&Gn.test(t[i]);)s=s*8+Xn(t[i++]);n=i-1,e+=String.fromCharCode(s)}}return e}var Et=class extends C{constructor(e,n,i,s){super(v.Quoted,e,n,i,s),this.input=e,this.begin=n,this.end=i,this.file=s,this.content=zs(this.getText())}},Pt=class extends C{constructor(e,n,i,s,a,r){super(v.Range,e,n,i,r),this.input=e,this.begin=n,this.end=i,this.lhs=s,this.rhs=a,this.file=r}},Dt=class extends ze{constructor(e,n,i,s,a){super(v.Tag,[n,i],e,n,i,!1,!1,a),this.tokenizer=new R(e,s.operators,a,this.contentRange,s.groupedExpressions),this.name=this.tokenizer.readTagName(),this.tokenizer.assert(this.name,"illegal liquid tag syntax"),this.tokenizer.skipBlank()}get args(){return this.tokenizer.input.slice(this.tokenizer.p,this.contentRange[1])}},Ge=class extends C{constructor(e,n,i,s,a,r){super(v.FilteredValue,i,s,a,r),this.initial=e,this.filters=n,this.input=i,this.begin=s,this.end=a,this.file=r}},js={now:()=>Date.now()};function $t(){return typeof global=="object"&&global.performance||typeof window=="object"&&window.performance||js}var Nt=class{renderTemplatesToNodeStream(e,n){let i=new jt;return Promise.resolve().then(()=>I(this.renderTemplates(e,n,i))).then(()=>i.end(),s=>i.error(s)),i.stream}*renderTemplates(e,n,i){i||(i=n.opts.keepOutputType?new Lt:new Ie),n.renderLimit.check($t().now());let s=[];for(let a of e){n.renderLimit.check($t().now());try{let r=yield a.render(n,i);if(r&&i.write(r),n.breakCalled||n.continueCalled)break}catch(r){let o=U.is(r)?r:new wt(r,a);if(n.opts.catchAllErrors)s.push(o);else throw o}}if(s.length)throw new Ne(s);return i.buffer}};function yn(t){return T(t)}var je=class{constructor(e,n,i){this.token=e,this.name=e.name,this.handler=S(n)?n:S(n?.handler)?n.handler:ui,this.raw=!S(n)&&!!n?.raw,this.args=e.args,this.liquid=i}*render(e,n){let i=[];for(let s of this.args)yn(s)?i.push([s[0],yield j(s[1],n)]):i.push(yield j(s,n));return yield this.handler.apply({context:n,token:this.token,liquid:this.liquid},[e,...i])}},Ke=class{constructor(e){this.postfix=[...Cs(e)]}*evaluate(e,n){z(e,"unable to evaluate: context not defined");let i=[];for(let s of this.postfix)if(xi(s)){let a=i.pop(),r;if(Ss[s.operator]===1)r=yield e.opts.operators[s.operator](a,e);else{let o=i.pop();r=yield e.opts.operators[s.operator](o,a,e)}i.push(r)}else i.push(yield j(s,e,n));return i[0]}valid(){return!!this.postfix.length}};function*j(t,e,n=!1){if(t){if("content"in t)return t.content;if(et(t))return yield Os(t,e,n);if(Si(t))return yield Fs(t,e);if(wn(t))return yield Ls(t,e,n)}}function*Ls(t,e,n){z(e.liquid,"FilteredValueToken evaluation requires liquid instance in context"),n=n||e.opts.lenientIf&&t.filters.length>0&&t.filters[0].name==="default";let i=yield t.initial.evaluate(e,n);for(let s of t.filters){let a=e.liquid.filters[s.name];z(a||!e.liquid.options.strictFilters,()=>`undefined filter: ${s.name}`),i=yield new je(s,a,e.liquid).render(i,e)}return i}function*Bt(t,e,n=!1){return yield m(yield j(t,e,n))}function*Os(t,e,n){let i=[];for(let s of t.props)i.push(yield Bt(s,e,!1));try{if(t.variable){let s=yield j(t.variable,e,n);return yield e._getFromScope(s,i)}else return yield e._get(i)}catch(s){if(n&&s.name==="InternalUndefinedVariableError")return null;throw new kt(s,t)}}function qs(t){return t.content}function*Fs(t,e){let n=yield Bt(t.lhs,e),i=yield Bt(t.rhs,e);return e.memoryLimit.use(i-n+1),ci(+n,+i+1)}function*Cs(t){let e=[];for(let n of t)if(xi(n)){for(;e.length&&e[e.length-1].getPrecedence()>n.getPrecedence();)yield e.pop();e.push(n)}else yield n;for(;e.length;)yield e.pop()}function ie(t,e){return!at(t,e)}function at(t,e){return t=m(t),e.opts.jsTruthy?!t:t===!1||t===void 0||t===null}var As={"==":function*(t,e){return yield K(t,e)},"!=":function*(t,e){return!(yield K(t,e))},">":function*(t,e){return $(t)?yield t.gt(e):$(e)?yield e.lt(t):(yield m(t))>(yield m(e))},"<":function*(t,e){return $(t)?yield t.lt(e):$(e)?yield e.gt(t):(yield m(t))<(yield m(e))},">=":function*(t,e){return $(t)?yield t.geq(e):$(e)?yield e.leq(t):(yield m(t))>=(yield m(e))},"<=":function*(t,e){return $(t)?yield t.leq(e):$(e)?yield e.geq(t):(yield m(t))<=(yield m(e))},contains:function*(t,e){return t=yield m(t),T(t)?yield bi(t,e):S(t?.indexOf)?t.indexOf(yield m(e))>-1:!1},not:function*(t,e){return at(yield m(t),e)},and:function*(t,e,n){return ie(yield m(t),n)&&ie(yield m(e),n)},or:function*(t,e,n){return ie(yield m(t),n)||ie(yield m(e),n)}};function*K(t,e){return $(t)?yield t.equals(e):$(e)?yield e.equals(t):(t=yield m(t),e=yield m(e),T(t)?T(e)&&(yield Rs(t,e)):t===e)}function*Rs(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(!(yield K(t[n],e[n])))return!1;return!0}function*bi(t,e){for(let n of t)if(yield K(n,e))return!0;return!1}var we=class{constructor(e,n,i,s){this.key=e,this.value=n,this.next=i,this.prev=s}},Xe=class{constructor(e,n=0){this.limit=e,this.size=n,this.cache={},this.head=new we("HEAD",null,null,null),this.tail=new we("TAIL",null,null,null),this.head.next=this.tail,this.tail.prev=this.head}write(e,n){if(this.cache[e])this.cache[e].value=n;else{let i=new we(e,n,this.head.next,this.head);this.head.next.prev=i,this.head.next=i,this.cache[e]=i,this.size++,this.ensureLimit()}}read(e){if(!this.cache[e])return;let{value:n}=this.cache[e];return this.remove(e),this.write(e,n),n}remove(e){let n=this.cache[e];n.prev.next=n.next,n.next.prev=n.prev,delete this.cache[e],this.size--}clear(){this.head.next=this.tail,this.tail.prev=this.head,this.size=0,this.cache={}}ensureLimit(){this.size>this.limit&&this.remove(this.tail.prev.key)}};function yi(t,e){let n=document.createElement("base");n.href=t;let i=document.getElementsByTagName("head")[0];i.insertBefore(n,i.firstChild);let s=document.createElement("a");s.href=e;let a=s.href;return i.removeChild(n),a}function Ms(t,e,n){return t.length&&es(t)!=="/"&&(t+="/"),yi(t,e).replace(/^(\w+:\/\/[^/]+)(\/[^?]+)/,(s,a,r)=>{let o=r.split("/").pop();return/\.\w+$/.test(o)?s:a+r+n})}function Es(t){return w(this,void 0,void 0,function*(){return new Promise((e,n)=>{let i=new XMLHttpRequest;i.onload=()=>{i.status>=200&&i.status<300?e(i.responseText):n(new Error(i.statusText))},i.onerror=()=>{n(new Error("An error occurred whilst receiving the response."))},i.open("GET",t),i.send()})})}function Ps(t){let e=new XMLHttpRequest;if(e.open("GET",t,!1),e.send(),e.status<200||e.status>=300)throw new Error(e.statusText);return e.responseText}function Ds(t){return w(this,void 0,void 0,function*(){return!0})}function $s(t){return!0}function Ns(t){return yi(t,".")}var Bs="/",Is=Object.freeze({__proto__:null,resolve:Ms,readFile:Es,readFileSync:Ps,exists:Ds,existsSync:$s,dirname:Ns,sep:Bs});function It(t,e){typeof e=="string"?t.use(e.length):e===null||typeof e=="number"||typeof e=="boolean"?t.use(JSON.stringify(e).length):Array.isArray(e)?t.use(e.length+1):typeof e=="object"&&t.use(2)}function Vs(t,e,...n){return t=m(t),T(t)||g(t)?t.length?t:e:t===!1&&new Map(n).get("allow_false")?!1:at(t,this.context)?e:t}function Zn(t,e=0){let n=this.context.memoryLimit;return JSON.stringify(t,(i,s)=>(It(n,s),s),e)}function Hs(t,e=0){let n=this.context.memoryLimit,i=[];return JSON.stringify(t,function(s,a){if(typeof a!="object"||a===null)return It(n,a),a;for(;i.length>0&&i[i.length-1]!==this;)i.pop();return i.includes(a)?(n.use(10),"[Circular]"):(i.push(a),It(n,a),a)},e)}function Us(t){return Number(t)}var Ws={raw:!0,handler:ui},vi={default:Vs,raw:Ws,jsonify:Zn,to_integer:Us,json:Zn,inspect:Hs},Js={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},Ys={"&amp;":"&","&lt;":"<","&gt;":">","&#34;":'"',"&#39;":"'"};function rt(t){return t=u(t),this.context.memoryLimit.use(t.length),t.replace(/&|<|>|"|'/g,e=>Js[e])}function Gs(t){return rt.call(this,t)}function Ks(t){return t=u(t),this.context.memoryLimit.use(t.length),t.replace(/&(amp|lt|gt|#34|#39);/g,e=>Ys[e])}function Xs(t){return rt.call(this,Ks.call(this,t))}function Zs(t){let e=u(t);return this.context.memoryLimit.use(e.length),e.replace(/\r?\n/gm,`<br />
`)}function Qs(t){let e=u(t);this.context.memoryLimit.use(e.length);let n=new Map([["<script","<\/script>"],["<style","</style>"],["<!--","-->"],["<",">"]]),i="",s=0;for(;s<e.length;){let a=e.indexOf("<",s);if(a<0)return i+e.slice(s);i+=e.slice(s,a);for(let[r,o]of n){if(!e.startsWith(r,a))continue;let l=e.indexOf(o,a+r.length);if(l>=0){s=l+o.length;break}n.delete(r)}if(s<=a)return i+e.slice(a)}return i}var ea=Object.freeze({__proto__:null,escape:rt,xml_escape:Gs,escape_once:Xs,newline_to_br:Zs,strip_html:Qs}),Vt=class{constructor(e){this.mapping=e,this.sep="/"}exists(e){return w(this,void 0,void 0,function*(){return this.existsSync(e)})}existsSync(e){return!x(this.mapping[e])}readFile(e){return w(this,void 0,void 0,function*(){return this.readFileSync(e)})}readFileSync(e){let n=this.mapping[e];if(x(n))throw new Error(`ENOENT: ${e}`);return n}dirname(e){let n=e.split(this.sep);return n.pop(),n.join(this.sep)}resolve(e,n,i){if(n+=i,e===".")return n;let s=e.split(/\/+/);for(let a of n.split(this.sep))a==="."||a===""||(a===".."?(s.length>1||s[0]!=="")&&s.pop():s.push(a));return s.join(this.sep)}},de={root:["."],layouts:["."],partials:["."],relativeReference:!0,jekyllInclude:!1,keyValueSeparator:":",cache:void 0,extname:"",fs:Is,dynamicPartials:!0,jsTruthy:!1,dateFormat:"%A, %B %-e, %Y at %-l:%M %P %z",locale:"",trimTagRight:!1,trimTagLeft:!1,trimOutputRight:!1,trimOutputLeft:!1,greedy:!0,tagDelimiterLeft:"{%",tagDelimiterRight:"%}",outputDelimiterLeft:"{{",outputDelimiterRight:"}}",preserveTimezones:!1,strictFilters:!1,strictVariables:!1,ownPropertyOnly:!0,lenientIf:!1,globals:{},keepOutputType:!1,operators:As,groupedExpressions:!1,memoryLimit:1/0,parseLimit:1/0,renderLimit:1/0};function ta(t){var e,n;if(t.hasOwnProperty("root")&&(t.hasOwnProperty("partials")||(t.partials=t.root),t.hasOwnProperty("layouts")||(t.layouts=t.root)),t.hasOwnProperty("cache")){let i;typeof t.cache=="number"?i=t.cache>0?new Xe(t.cache):void 0:typeof t.cache=="object"?i=t.cache:i=t.cache?new Xe(1024):void 0,t.cache=i}return t=Object.assign(Object.assign(Object.assign({},de),t.jekyllInclude?{dynamicPartials:!1}:{}),t),(!t.fs.dirname||!t.fs.sep)&&t.relativeReference&&(console.warn("[LiquidJS] `fs.dirname` and `fs.sep` are required for relativeReference, set relativeReference to `false` to suppress this warning"),t.relativeReference=!1),t.root=De(t.root),t.partials=De(t.partials),t.layouts=De(t.layouts),t.outputEscape=t.outputEscape&&na(t.outputEscape),t.locale||(t.locale=(n=(e=mi())===null||e===void 0?void 0:e().resolvedOptions().locale)!==null&&n!==void 0?n:"en-US"),t.templates&&(t.fs=new Vt(t.templates),t.relativeReference=!0,t.root=t.partials=t.layouts="."),t}function na(t){return t==="escape"?rt:t==="json"?vi.json:(z(S(t),"`outputEscape` need to be of type string or function"),t)}function De(t){let e=[];return T(t)&&(e=t),g(t)&&(e=[t]),e}function ia(t,e){let n=!1;for(let i=0;i<t.length;i++){let s=t[i];ca(s)&&(!n&&s.trimLeft&&sa(t[i-1],e.greedy),re(s)&&(s.name==="raw"?n=!0:s.name==="endraw"&&(n=!1)),!n&&s.trimRight&&aa(t[i+1],e.greedy))}}function sa(t,e){if(!t||!vn(t))return;let n=e?pe:pi;for(;y[t.input.charCodeAt(t.end-1-t.trimRight)]&n;)t.trimRight++}function aa(t,e){if(!t||!vn(t))return;let n=e?pe:pi;for(;y[t.input.charCodeAt(t.begin+t.trimLeft)]&n;)t.trimLeft++;t.input.charAt(t.begin+t.trimLeft)===`
`&&t.trimLeft++}var R=class{constructor(e,n=de.operators,i,s,a=!1){this.input=e,this.file=i,this.rawBeginAt=-1,this.p=s?s[0]:0,this.N=s?s[1]:e.length,this.opTrie=Un(n),this.literalTrie=Un(hi),this.groupedExpressions=a}readExpression(){return new Ke(this.readExpressionTokens())}*readExpressionTokens(){for(;this.p<this.N;){let e=this.readOperator();if(e){yield e;continue}let n=this.readValue();if(n){yield n;continue}return}}readOperator(){this.skipBlank();let e=this.matchTrie(this.opTrie);if(e!==-1)return new Rt(this.input,this.p,this.p=e,this.file)}matchTrie(e){let n=e,i=this.p,s;for(;n[this.input[i]]&&i<this.N;)n=n[this.input[i++]],n.end&&(s=n);return!s||s.needBoundary&&Ee(this.peek(i-this.p))?-1:i}readFilteredValue(){let e=this.p,n=this.readExpression();this.assert(n.valid(),`invalid value expression: ${this.snapshot()}`);let i=this.readFilters();return new Ge(n,i,this.input,e,this.p,this.file)}readFilters(){let e=[];for(;;){let n=this.readFilter();if(!n)return e;e.push(n)}}readFilter(){if(this.skipBlank(),this.end()||this.peek()===")")return null;this.assert(this.read()==="|",'expected "|" before filter');let e=this.readIdentifier();if(!e.size())return this.assert(this.end(),"expected filter name"),null;let n=[];if(this.skipBlank(),this.peek()===":")do{++this.p;let i=this.readFilterArg();i&&n.push(i),this.skipBlank(),this.assert(this.end()||this.peek()===","||this.peek()==="|"||this.peek()===")",()=>`unexpected character ${this.snapshot()}`)}while(this.peek()===",");else if(!(this.peek()==="|"||this.peek()===")"||this.end()))throw this.error('expected ":" after filter name');return new Ye(e.getText(),n,this.input,e.begin,this.p,this.file)}readFilterArg(){let e=this.readValue();if(!e)return;if(this.skipBlank(),this.peek()!==":")return e;++this.p;let n=this.readValue();return[e.getText(),n]}readTopLevelTokens(e=de){let n=[];for(;this.p<this.N;){let i=this.readTopLevelToken(e);n.push(i)}return ia(n,e),n}readTopLevelToken(e){let{tagDelimiterLeft:n,outputDelimiterLeft:i}=e;return this.rawBeginAt>-1?this.readEndrawOrRawContent(e):this.match(n)?this.readTagToken(e):this.match(i)?this.readOutputToken(e):this.readHTMLToken([n,i])}readHTMLToken(e){let n=this.p;for(;this.p<this.N&&!e.some(i=>this.match(i));)++this.p;return new We(this.input,n,this.p,this.file)}readTagToken(e){let{file:n,input:i}=this,s=this.p;if(this.readToDelimiter(e.tagDelimiterRight)===-1)throw this.error(`tag ${this.snapshot(s)} not closed`,s);let a=new Ue(i,s,this.p,e,n);return a.name==="raw"&&(this.rawBeginAt=s),a}readToDelimiter(e,n=!1){for(this.skipBlank();this.p<this.N;){if(n&&this.peekType()&In){this.readQuoted();continue}if(++this.p,this.rmatch(e))return this.p}return-1}readOutputToken(e=de){let{file:n,input:i}=this,{outputDelimiterRight:s}=e,a=this.p;if(this.readToDelimiter(s,!0)===-1)throw this.error(`output ${this.snapshot(a)} not closed`,a);return new Ft(i,a,this.p,e,n)}readEndrawOrRawContent(e){let{tagDelimiterLeft:n,tagDelimiterRight:i}=e,s=this.p,a=this.readTo(n)-n.length;for(;this.p<this.N;){if(this.readIdentifier().getText()!=="endraw"){a=this.readTo(n)-n.length;continue}for(;this.p<=this.N;){if(this.rmatch(i)){let r=this.p;return s===a?(this.rawBeginAt=-1,new Ue(this.input,s,r,e,this.file)):(this.p=a,new We(this.input,s,a,this.file))}if(this.rmatch(n))break;this.p++}}throw this.error(`raw ${this.snapshot(this.rawBeginAt)} not closed`,s)}readLiquidTagTokens(e=de){let n=[];for(;this.p<this.N;){let i=this.readLiquidTagToken(e);i&&n.push(i)}return n}readLiquidTagToken(e){if(this.skipBlank(),this.end())return;let n=this.p;this.readToDelimiter(`
`);let i=this.p;return new Dt(this.input,n,i,e,this.file)}error(e,n=this.p){return new yt(e,new ve(this.input,n,this.N,this.file))}assert(e,n,i){if(!e)throw this.error(typeof n=="function"?n():n,i)}snapshot(e=this.p){return JSON.stringify(is(this.input.slice(e,this.N),32))}readWord(){return this.readIdentifier()}readIdentifier(){this.skipBlank();let e=this.p;for(;!this.end()&&Ee(this.peek());)++this.p;return new ve(this.input,e,this.p,this.file)}readNonEmptyIdentifier(){let e=this.readIdentifier();return e.size()?e:void 0}readTagName(){return this.skipBlank(),this.input[this.p]==="#"?this.input.slice(this.p,++this.p):this.readIdentifier().getText()}readHashes(e){let n=[];for(;;){let i=this.readHash(e);if(!i)return n;n.push(i)}}readHash(e){this.skipBlank(),this.peek()===","&&++this.p;let n=this.p,i=this.readNonEmptyIdentifier();if(!i)return;let s;this.skipBlank();let a=g(e)?e:e?"=":":";return this.peek()===a&&(++this.p,s=this.readValue()),new Mt(this.input,n,this.p,i,s,this.file)}remaining(){return this.input.slice(this.p,this.N)}advance(e=1){this.p+=e}end(){return this.p>=this.N}read(){return this.input[this.p++]}readTo(e){for(;this.p<this.N;)if(++this.p,this.rmatch(e))return this.p;return-1}readValue(){this.skipBlank();let e=this.p,n=this.readLiteral()||this.readQuoted()||this.readNumber();!n&&this.peek()==="("&&(n=this.readGroupOrRange());let i=this.readProperties(!n);return i.length?new Je(n,i,this.input,e,this.p):n}readScopeValue(){this.skipBlank();let e=this.p,n=this.readProperties();if(n.length)return new Je(void 0,n,this.input,e,this.p)}readProperties(e=!0){let n=[];for(;;){if(this.peek()==="["){this.p++;let i=this.readValue()||new ve(this.input,this.p,this.p,this.file);this.assert(this.readTo("]")!==-1,"[ not closed"),n.push(i);continue}if(e&&!n.length){let i=this.readNonEmptyIdentifier();if(i){n.push(i);continue}}if(this.peek()==="."&&this.peek(1)!=="."){this.p++;let i=this.readNonEmptyIdentifier();if(!i)break;n.push(i);continue}break}return n}readNumber(){this.skipBlank();let e=!1,n=!1,i=0;for(this.peekType()&ds&&i++;this.p+i<=this.N;)if(this.peekType(i)&cs)n=!0,i++;else if(this.peek(i)==="."&&this.peek(i+1)!=="."){if(e||!n)return;e=!0,i++}else break;if(n&&!Ee(this.peek(i))){let s=new Ct(this.input,this.p,this.p+i,this.file);return this.advance(i),s}}readLiteral(){this.skipBlank();let e=this.matchTrie(this.literalTrie);if(e===-1)return;let n=new At(this.input,this.p,e,this.file);return this.p=e,n}readGroupOrRange(){this.skipBlank();let e=this.p;if(this.peek()!=="(")return;++this.p;let n=this.readValueOrThrow();if(this.skipBlank(),this.peek()==="."&&this.peek(1)==="."){this.p+=2;let i=this.readValueOrThrow();return this.skipBlank(),this.assert(this.read()===")","invalid range syntax"),new Pt(this.input,e,this.p,n,i,this.file)}if(this.groupedExpressions){let i=new Ke([n,...this.readExpressionTokens()]);this.assert(i.valid(),()=>`invalid value expression: ${this.snapshot()}`);let s=this.readFilters();return this.skipBlank(),this.assert(this.read()===")","unbalanced parentheses"),new Ge(i,s,this.input,e,this.p,this.file)}throw this.error("invalid range syntax")}readValueOrThrow(){let e=this.readValue();return this.assert(e,()=>`unexpected token ${this.snapshot()}, value expected`),e}readQuoted(){this.skipBlank();let e=this.p;if(!(this.peekType()&In))return;++this.p;let n=!1;for(;this.p<this.N&&(++this.p,!(this.input[this.p-1]===this.input[e]&&!n));)n?n=!1:this.input[this.p-1]==="\\"&&(n=!0);return new Et(this.input,e,this.p,this.file)}*readFileNameTemplate(e){let{outputDelimiterLeft:n}=e,i=[","," ","\r",`
`,"	",n],s=new Set(i);for(;this.p<this.N&&!s.has(this.peek());)yield this.match(n)?this.readOutputToken(e):this.readHTMLToken(i)}match(e){for(let n=0;n<e.length;n++)if(e[n]!==this.input[this.p+n])return!1;return!0}rmatch(e){for(let n=0;n<e.length;n++)if(e[e.length-1-n]!==this.input[this.p-1-n])return!1;return!0}peekType(e=0){return this.p+e>=this.N?0:y[this.input.charCodeAt(this.p+e)]}peek(e=0){return this.p+e>=this.N?"":this.input[this.p+e]}skipBlank(){for(;this.peekType()&pe;)++this.p}},Ht=class{constructor(e,n){this.handlers={},this.stopRequested=!1,this.tokens=e,this.parseToken=n}on(e,n){return this.handlers[e]=n,this}trigger(e,n){let i=this.handlers[e];return i?(i.call(this,n),!0):!1}start(){this.trigger("start");let e;for(;!this.stopRequested&&(e=this.tokens.shift());){if(this.trigger("token",e)||re(e)&&this.trigger(`tag:${e.name}`,e))continue;let n=this.parseToken(e,this.tokens);this.trigger("template",n)}return this.stopRequested||this.trigger("end"),this}stop(){return this.stopRequested=!0,this}},Le=class{constructor(e){this.token=e}},b=class extends Le{constructor(e,n,i){super(e),this.name=e.name,this.liquid=i,this.tokenizer=e.tokenizer}},E=class{constructor(e,n){this.hash={};let i=e instanceof R?e:new R(e,{});for(let s of i.readHashes(n))this.hash[s.name.content]=s.value}*render(e){let n={};for(let i of Object.keys(this.hash))n[i]=this.hash[i]===void 0?!0:yield j(this.hash[i],e);return n}};function ra(t){return class extends b{constructor(e,n,i){super(e,n,i),S(t.parse)&&t.parse.call(this,e,n)}*render(e,n){let i=yield new E(this.token.args,e.opts.keyValueSeparator).render(e);return yield t.render.call(this,e,n,i)}}}var F=class{constructor(e,n){this.filters=[];let i=typeof e=="string"?new R(e,n.options.operators,void 0,void 0,n.options.groupedExpressions).readFilteredValue():e;this.initial=i.initial,this.filters=i.filters.map(s=>new je(s,this.getFilter(n,s.name),n))}*value(e,n){n=n||e.opts.lenientIf&&this.filters.length>0&&this.filters[0].name==="default";let i=yield this.initial.evaluate(e,n);for(let s of this.filters)i=yield s.render(i,e);return i}getFilter(e,n){let i=e.filters[n];return z(i||!e.options.strictFilters,()=>`undefined filter: ${n}`),i}},Ut=class extends Le{constructor(e,n){var i;super(e);let s=new R(e.input,n.options.operators,e.file,e.contentRange,n.options.groupedExpressions);this.value=new F(s.readFilteredValue(),n);let a=this.value.filters,r=n.options.outputEscape;if(!(!((i=a[a.length-1])===null||i===void 0)&&i.raw)&&r){let o=new Ye(toString.call(r),[],"",0,0);a.push(new je(o,r,n))}}*render(e,n){let i=yield m(yield this.value.value(e,!1));n.write(i)}*arguments(){yield this.value}},Wt=class extends Le{constructor(e){super(e),this.str=e.getContent()}*render(e,n){n.write(this.str)}},ae=class t{constructor(e,n){this.segments=e,this.location=n}toString(){return Qe(this.segments,!0)}toArray(){function*e(...n){for(let i of n)i instanceof t?yield Array.from(e(...i.segments)):yield i}return Array.from(e(...this.segments))}},ke=class{constructor(){this.map=new Map}get(e){let n=Qe([e.segments[0]]);return this.map.has(n)||this.map.set(n,[]),this.map.get(n)}has(e){return this.map.has(Qe([e.segments[0]]))}push(e){this.get(e).push(e)}asObject(){return Object.fromEntries(this.map)}},wi={partials:!0};function*ki(t,e,n){let i=new ke,s=new ke,a=new ke,r=new Ze(new Set),o=new Set;function l(d,p){i.push(d);let h=p.alias(d);if(h!==void 0){let _=h.segments[0];g(_)&&!r.has(_)&&s.push(h)}else{let _=d.segments[0];g(_)&&!p.has(_)&&s.push(d)}for(let _ of d.segments)_ instanceof ae&&l(_,p)}function*c(d,p){if(d.arguments)for(let h of d.arguments())for(let _ of Qn(h))l(_,p);if(d.localScope)for(let h of d.localScope()){p.add(h.content),p.deleteAlias(h.content);let[_,f]=h.getPosition();a.push(new ae([h.content],{row:_,col:f,file:h.file}))}if(d.children)if(d.partialScope){let h=d.partialScope();if(h===void 0){for(let k of yield d.children(e,n))yield c(k,p);return}if(o.has(h.name))return;let _=new Set,f=h.isolated?new Ze(_):p.push(_);for(let k of h.scope)if(g(k))_.add(k);else{let[A,mt]=k;_.add(A);let le=Array.from(Qn(mt));le.length&&f.setAlias(A,le[0].segments)}for(let k of yield d.children(e,n))yield c(k,f),o.add(h.name);f.pop()}else{d.blockScope&&p.push(new Set(d.blockScope()));for(let h of yield d.children(e,n))yield c(h,p);d.blockScope&&p.pop()}}for(let d of t)yield c(d,r);return{variables:i.asObject(),globals:s.asObject(),locals:a.asObject()}}function J(t,e={}){let n=Object.assign(Object.assign({},wi),e);return I(ki(t,n.partials,!1))}function Y(t,e={}){let n=Object.assign(Object.assign({},wi),e);return V(ki(t,n.partials,!0))}var Ze=class{constructor(e){this.stack=[{names:e,aliases:new Map}]}has(e){for(let n of this.stack)if(n.names.has(e))return!0;return!1}push(e){return this.stack.push({names:e,aliases:new Map}),this}pop(){var e;return(e=this.stack.pop())===null||e===void 0?void 0:e.names}add(e){this.stack[0].names.add(e)}alias(e){let n=e.segments[0];if(!g(n))return;let i=this.getAlias(n);if(i!==void 0)return new ae([...i,...e.segments.slice(1)],e.location)}setAlias(e,n){this.stack[this.stack.length-1].aliases.set(e,n)}deleteAlias(e){this.stack[this.stack.length-1].aliases.delete(e)}getAlias(e){for(let n of this.stack){if(n.aliases.has(e))return n.aliases.get(e);if(n.names.has(e))return}}};function*Qn(t){O(t)?yield*H(t):t instanceof F&&(yield*oa(t))}function*oa(t){for(let e of t.initial.postfix)O(e)&&(yield*H(e));for(let e of t.filters)for(let n of e.args)yn(n)&&n[1]?yield*H(n[1]):O(n)&&(yield*H(n))}function*H(t){Si(t)?(yield*H(t.lhs),yield*H(t.rhs)):wn(t)?yield*la(t):et(t)&&(yield Jt(t))}function*la(t){if(wn(t)){for(let e of t.initial.postfix)O(e)&&(yield*H(e));for(let e of t.filters)for(let n of e.args)yn(n)&&n[1]?yield*H(n[1]):O(n)&&(yield*H(n))}}function Jt(t){let e=[],n=t.file,i=t.props[0];n=n||i.file,Gt(i)||ti(i)||ni(i)?e.push(i.content):et(i)&&e.push(...Jt(i).segments);for(let r of t.props.slice(1))n=n||r.file,Gt(r)||ti(r)||ni(r)?e.push(r.content):et(r)&&e.push(Jt(r));let[s,a]=t.getPosition();return new ae(e,{row:s,col:a,file:n})}var ei=/^[\u0080-\uFFFFa-zA-Z_][\u0080-\uFFFFa-zA-Z0-9_-]*$/;function Qe(t,e=!1){let n=[],i=t[0];g(i)&&(!e||i.match(ei)?n.push(`${i}`):n.push(`['${i}']`));for(let s of t.slice(1))s instanceof ae?n.push(`[${Qe(s.segments)}]`):g(s)?s.match(ei)?n.push(`.${s}`):n.push(`['${s}']`):n.push(`[${s}]`);return n.join("")}var he;(function(t){t.Partials="partials",t.Layouts="layouts",t.Root="root"})(he||(he={}));var Yt=class{constructor(e){var n,i,s,a;if(this.options=e,e.relativeReference){let o=e.fs.sep;z(o,"`fs.sep` is required for relative reference");let l=["."+o,".."+o,"./","../"];this.shouldLoadRelative=c=>l.some(d=>c.startsWith(d))}else this.shouldLoadRelative=o=>!1;let r=e.fs;this.contains=Ot(((n=r.contains)===null||n===void 0?void 0:n.bind(r))||(()=>w(this,void 0,void 0,function*(){return!0})),((i=r.containsSync)===null||i===void 0?void 0:i.bind(r))||(()=>!0)),this.exists=Ot(((s=r.exists)===null||s===void 0?void 0:s.bind(r))||(()=>w(this,void 0,void 0,function*(){return!1})),(a=r.existsSync)===null||a===void 0?void 0:a.bind(r))}*lookup(e,n,i,s){let a=this.options[n];for(let r of this.candidates(e,a,s)){let o=!1;for(let l of a)if(yield this.contains(!!i,l,r)){o=!0;break}if(o&&(yield this.exists(!!i,r)))return r}throw this.lookupError(e,a)}*candidates(e,n,i){let{fs:s,extname:a}=this.options;this.shouldLoadRelative(e)&&i&&(yield s.resolve(this.dirname(i),e,a));for(let r of n)yield s.resolve(r,e,a);if(s.fallback!==void 0){let r=s.fallback(e);r!==void 0&&(yield r)}}dirname(e){let n=this.options.fs;return z(n.dirname,"`fs.dirname` is required for relative reference"),n.dirname(e)}lookupError(e,n){let i=new Error("ENOENT");return i.message=`ENOENT: Failed to lookup "${e}" in "${n}"`,i.code="ENOENT",i}},B=class{constructor(e){var n,i;this.liquid=e,this.cache=this.liquid.options.cache,this.fs=this.liquid.options.fs,this.parseFile=this.cache?this._parseFileCached:this._parseFile,this.loader=new Yt(this.liquid.options),this.parseLimit=new Te("parse length",e.options.parseLimit),this.readFile=Ot(((n=this.fs.readFile)===null||n===void 0?void 0:n.bind(this.fs))||(()=>w(this,void 0,void 0,function*(){throw new Error("readFile not implemented")})),(i=this.fs.readFileSync)===null||i===void 0?void 0:i.bind(this.fs))}parse(e,n){e=String(e),this.parseLimit.use(e.length);let s=new R(e,this.liquid.options.operators,n,void 0,this.liquid.options.groupedExpressions).readTopLevelTokens(this.liquid.options);return this.parseTokens(s)}parseTokens(e){let n,i=[],s=[];for(;n=e.shift();)try{i.push(this.parseToken(n,e))}catch(a){if(this.liquid.options.catchAllErrors)s.push(a);else throw a}if(s.length)throw new Ne(s);return i}parseToken(e,n){try{if(re(e)){let i=this.liquid.tags[e.name];return z(i,`tag "${e.name}" not found`),new i(e,n,this.liquid,this)}return da(e)?new Ut(e,this.liquid):new Wt(e)}catch(i){throw U.is(i)?i:new vt(i,e)}}parseStream(e){return new Ht(e,(n,i)=>this.parseToken(n,i))}*_parseFileCached(e,n,i=he.Root,s){let a=this.cache,r=this.loader.shouldLoadRelative(e)?s+","+e:i+":"+e,o=yield a.read(r);if(o)return o;let l=this._parseFile(e,n,i,s),c=n?yield l:I(l);a.write(r,c);try{return yield c}catch(d){throw a.remove(r),d}}*_parseFile(e,n,i=he.Root,s){let a=yield this.loader.lookup(e,i,n,s);return this.parse(yield this.readFile(!!n,a),a)}},v;(function(t){t[t.Number=1]="Number",t[t.Literal=2]="Literal",t[t.Tag=4]="Tag",t[t.Output=8]="Output",t[t.HTML=16]="HTML",t[t.Filter=32]="Filter",t[t.Hash=64]="Hash",t[t.PropertyAccess=128]="PropertyAccess",t[t.Word=256]="Word",t[t.Range=512]="Range",t[t.Quoted=1024]="Quoted",t[t.Operator=2048]="Operator",t[t.FilteredValue=4096]="FilteredValue",t[t.GroupedExpression=8192]="GroupedExpression",t[t.Delimited=12]="Delimited"})(v||(v={}));function ca(t){return!!(M(t)&v.Delimited)}function xi(t){return M(t)===v.Operator}function vn(t){return M(t)===v.HTML}function da(t){return M(t)===v.Output}function re(t){return M(t)===v.Tag}function Gt(t){return M(t)===v.Quoted}function ti(t){return M(t)===v.Number}function et(t){return M(t)===v.PropertyAccess}function ni(t){return M(t)===v.Word}function Si(t){return M(t)===v.Range}function wn(t){return M(t)===v.FilteredValue}function O(t){return(M(t)&5763)>0}function M(t){return t?t.kind:-1}function X(t){let e=Object.create(null);return t&&Object.assign(e,t),e}var ne=class t{constructor(e={},n=de,i={},{memoryLimit:s,renderLimit:a,liquid:r}={}){var o,l,c,d,p;this.scopes=[X()],this.registers={},this.breakCalled=!1,this.continueCalled=!1,this.sync=!!i.sync,this.opts=n,this.globals=(o=i.globals)!==null&&o!==void 0?o:n.globals,this.environments=it(e)?e:Object(e),this.strictVariables=(l=i.strictVariables)!==null&&l!==void 0?l:this.opts.strictVariables,this.ownPropertyOnly=(c=i.ownPropertyOnly)!==null&&c!==void 0?c:n.ownPropertyOnly,this.memoryLimit=s??new Te("memory alloc",(d=i.memoryLimit)!==null&&d!==void 0?d:n.memoryLimit),this.renderLimit=a??new Te("template render",$t().now()+((p=i.renderLimit)!==null&&p!==void 0?p:n.renderLimit)),this.liquid=r}getRegister(e,n=void 0){return this.registers[e]=this.registers[e]||n}setRegister(e,n){return this.registers[e]=n}saveRegister(...e){return e.map(n=>[n,this.getRegister(n)])}restoreRegister(e){return e.forEach(([n,i])=>this.setRegister(n,i))}getAll(){return[this.globals,this.environments,...this.scopes].reduce((e,n)=>He(e,n),{})}get(e){return this.getSync(e)}getSync(e){return V(this._get(e))}*_get(e){let n=this.findScope(e[0]);return yield this._getFromScope(n,e)}getFromScope(e,n){return V(this._getFromScope(e,n))}*_getFromScope(e,n,i=this.strictVariables){g(n)&&(n=n.split("."));for(let s=0;s<n.length;s++)if(e=yield this.readProperty(e,n[s]),i&&Zi(e))throw new xt(n.slice(0,s+1).join("."));return e}push(e){return this.scopes.push(e)}pop(){return this.scopes.pop()}bottom(){return this.scopes[0]}spawn(e={}){return new t(e,this.opts,{sync:this.sync,globals:this.globals,strictVariables:this.strictVariables,ownPropertyOnly:this.ownPropertyOnly},{renderLimit:this.renderLimit,memoryLimit:this.memoryLimit,liquid:this.liquid})}findScope(e){for(let n=this.scopes.length-1;n>=0;n--){let i=this.scopes[n];if(e in i)return i}return e in this.environments?this.environments:this.globals}readProperty(e,n){if(e=oi(e),n=m(n),x(e))return e;if(T(e)&&Fe(n))return Oe(e,n,this.ownPropertyOnly);let i=kn(e,n,this.ownPropertyOnly);return i===void 0&&e instanceof q?e.liquidMethodMissing(n,this):S(i)?i.call(e):n==="size"?ha(e):n==="first"?ua(e,this.ownPropertyOnly):n==="last"?pa(e,this.ownPropertyOnly):i}};function kn(t,e,n){if(!(n&&!nt.call(t,e)&&!(t instanceof q)))return t[e]}function ua(t,e){return T(t)?Oe(t,0,e):kn(t,"first",e)}function pa(t,e){return T(t)?Oe(t,-1,e):kn(t,"last",e)}function ha(t){if(nt.call(t,"size")||t.size!==void 0)return t.size;if(T(t)||g(t))return t.length;if(typeof t=="object")return Object.keys(t).length}var se;(function(t){t[t.OUTPUT=0]="OUTPUT",t[t.STORE=1]="STORE"})(se||(se={}));var fa=N(Math.abs),ma=N(Math.max),ga=N(Math.min),_a=N(Math.ceil),ba=N((t,e,n=!1)=>n?Math.floor(t/e):t/e),ya=N(Math.floor),va=N((t,e)=>t-e),wa=N((t,e)=>t+e),ka=N((t,e)=>(t%e+e)%e),xa=N((t,e)=>t*e);function Sa(t,e=0){t=bt(t),e=bt(e);let n=Math.pow(10,e),i=t*n*(1+Number.EPSILON);return Math.round(i)/n}var Ta=Object.freeze({__proto__:null,abs:fa,at_least:ma,at_most:ga,ceil:_a,divided_by:ba,floor:ya,minus:va,plus:wa,modulo:ka,times:xa,round:Sa}),za=t=>decodeURIComponent(u(t).replace(/\+/g," ")),ja=t=>encodeURIComponent(u(t)).replace(/%20/g,"+"),La=t=>encodeURIComponent(u(t)).replace(/%20/g,"+").replace(/[!'()*]/g,e=>"%"+e.charCodeAt(0).toString(16).toUpperCase()),Oa=t=>encodeURI(u(t)).replace(/%5B/g,"[").replace(/%5D/g,"]"),ii=/[^\p{M}\p{L}\p{Nd}]+/ug,qa={raw:/\s+/g,default:ii,pretty:/[^\p{M}\p{L}\p{Nd}._~!$&'()+,;=@]+/ug,ascii:/[^A-Za-z0-9]+/g,latin:ii,none:null};function Fa(t,e="default",n=!1){t=u(t);let i=qa[e];return i&&(e==="latin"&&(t=Ca(t)),t=t.replace(i,"-").replace(/^-|-$/g,"")),n?t:t.toLowerCase()}function Ca(t){return t.replace(/[àáâãäå]/g,"a").replace(/[æ]/g,"ae").replace(/[ç]/g,"c").replace(/[èéêë]/g,"e").replace(/[ìíîï]/g,"i").replace(/[ð]/g,"d").replace(/[ñ]/g,"n").replace(/[òóôõöø]/g,"o").replace(/[ùúûü]/g,"u").replace(/[ýÿ]/g,"y").replace(/[ß]/g,"ss").replace(/[œ]/g,"oe").replace(/[þ]/g,"th").replace(/[ẞ]/g,"SS").replace(/[Œ]/g,"OE").replace(/[Þ]/g,"TH")}var Aa=Object.freeze({__proto__:null,url_decode:za,url_encode:ja,cgi_escape:La,uri_escape:Oa,slugify:Fa}),Ra=st(function(t,e){let n=L(t),i=x(e)?" ":u(e),s=i.length*Math.max(n.length-1,0);for(let a=0;a<n.length;a++)s+=String(n[a]).length;return this.context.memoryLimit.use(s),Array.prototype.join.call(n,i)}),Ma=st(function(t){return li(t)?Oe(t,-1,this.context.ownPropertyOnly):""}),Ea=st(function(t){return li(t)?Oe(t,0,this.context.ownPropertyOnly):""}),Pa=st(function(t){let e=L(t);return this.context.memoryLimit.use(e.length),[...e].reverse()});function*Ti(t,e,n){let i=[],s=L(t);this.context.memoryLimit.use(s.length);for(let a of s)i.push([a,e?yield this.context._getFromScope(a,u(e).split("."),!1):a]);return i.sort((a,r)=>n(a[1],r[1])).map(a=>a[0])}function*Da(t,e){return yield*Ti.call(this,t,e,ss)}function*$a(t,e){return yield*Ti.call(this,t,e,as)}var Na=t=>t&&t.length||0;function*Ba(t,e){let n=[],i=L(t);this.context.memoryLimit.use(i.length);for(let s of i)n.push(yield this.context._getFromScope(s,u(e),!1));return n}function*Ia(t,e){let n=0,i=L(t);for(let s of i){let a=Number(e?yield this.context._getFromScope(s,u(e),!1):s);n+=Number.isNaN(a)?0:a}return n}function Va(t){let e=L(t);return this.context.memoryLimit.use(e.length),Array.prototype.filter.call(e,n=>!x(m(n)))}function zi(t,e=[]){let n=L(t),i=L(e);return this.context.memoryLimit.use(n.length+i.length),Array.prototype.concat.call(n,i)}function Ha(t,e){return zi.call(this,t,[e])}function Ua(t,e){let n=L(t);this.context.memoryLimit.use(n.length);let i=[...n];return i.unshift(e),i}function Wa(t){let e=L(t);this.context.memoryLimit.use(e.length);let n=[...e];return n.pop(),n}function Ja(t){let e=L(t);this.context.memoryLimit.use(e.length);let n=[...e];return n.shift(),n}function Ya(t,e,n=1){return t=m(t),x(t)?[]:(T(t)||(t=u(t)),e=e<0?t.length+e:e,e<0||n<0?T(t)?[]:"":(this.context.memoryLimit.use(n),T(t)?Array.prototype.slice.call(t,e,e+n):String.prototype.slice.call(t,e,e+n)))}function*ji(t,e){return this.context.opts.jekyllWhere?xe.is(e)?yield K(t,e):T(t)?yield bi(t,e):yield K(t,e):e===void 0?ie(t,this.context):yield K(t,e)}function*Li(t,e,n,i){e=L(e),this.context.memoryLimit.use(e.length);let s=new R(u(n)).readScopeValue(),a=[];for(let r of e){let o=yield j(s,this.context.spawn(r));(yield ji.call(this,o,i))===t&&a.push(r)}return a}function*Oi(t,e,n,i){let s=[],a=new F(u(i),this.liquid),r=L(e);this.context.memoryLimit.use(r.length);for(let o of r){this.context.push({[n]:o});let l=yield a.value(this.context);this.context.pop(),l===t&&s.push(o)}return s}function*Ga(t,e,n){return yield*Li.call(this,!0,t,e,n)}function*Ka(t,e,n){return yield*Li.call(this,!1,t,e,n)}function*Xa(t,e,n){return yield*Oi.call(this,!0,t,e,n)}function*Za(t,e,n){return yield*Oi.call(this,!1,t,e,n)}function*Qa(t,e){let n=new Map;t=qe(t);let i=new R(u(e)).readScopeValue();this.context.memoryLimit.use(t.length);for(let s of t){let a=yield j(i,this.context.spawn(s));n.has(a)||n.set(a,[]),n.get(a).push(s)}return[...n.entries()].map(([s,a])=>({name:s,items:a}))}function*er(t,e,n){let i=new Map,s=new F(u(n),this.liquid);t=qe(t),this.context.memoryLimit.use(t.length);for(let a of t){this.context.push({[e]:a});let r=yield s.value(this.context);this.context.pop(),i.has(r)||i.set(r,[]),i.get(r).push(a)}return[...i.entries()].map(([a,r])=>({name:a,items:r}))}function*xn(t,e,n){let i=new R(u(e)).readScopeValue(),s=L(t);for(let a=0;a<s.length;a++){let r=yield j(i,this.context.spawn(s[a]));if(yield ji.call(this,r,n))return[a,s[a]]}}function*Sn(t,e,n){let i=new F(u(n),this.liquid),s=L(t);for(let a=0;a<s.length;a++){this.context.push({[e]:s[a]});let r=yield i.value(this.context);if(this.context.pop(),r)return[a,s[a]]}}function*tr(t,e,n){return!!(yield*xn.call(this,t,e,n))}function*nr(t,e,n){return!!(yield*Sn.call(this,t,e,n))}function*ir(t,e,n){let i=yield*xn.call(this,t,e,n);return i?i[0]:void 0}function*sr(t,e,n){let i=yield*Sn.call(this,t,e,n);return i?i[0]:void 0}function*ar(t,e,n){let i=yield*xn.call(this,t,e,n);return i?i[1]:void 0}function*rr(t,e,n){let i=yield*Sn.call(this,t,e,n);return i?i[1]:void 0}function or(t){return t=L(t),this.context.memoryLimit.use(t.length),[...new Set(t)]}function lr(t,e=1){if(t=m(t),x(t))return[];T(t)||(t=u(t)),this.context.memoryLimit.use(t.length);let n=[...t].sort(()=>Math.random()-.5);return e===1?n[0]:n.slice(0,e)}var cr=Object.freeze({__proto__:null,join:Ra,last:Ma,first:Ea,reverse:Pa,sort:Da,sort_natural:$a,size:Na,map:Ba,sum:Ia,compact:Va,concat:zi,push:Ha,unshift:Ua,pop:Wa,shift:Ja,slice:Ya,where:Ga,reject:Ka,where_exp:Xa,reject_exp:Za,group_by:Qa,group_by_exp:er,has:tr,has_exp:nr,find_index:ir,find_index_exp:sr,find:ar,find_exp:rr,uniq:or,sample:lr});function Tn(t,e,n){var i,s;let a=((i=t?.length)!==null&&i!==void 0?i:0)+((s=n?.length)!==null&&s!==void 0?s:0);this.context.memoryLimit.use(a);let r=Fi(t,this.context.opts,n);return r?(e=m(e),e=x(e)?this.context.opts.dateFormat:u(e),this.context.memoryLimit.use(e.length),Pe(r,e,this.context.memoryLimit)):t}function dr(t){return Tn.call(this,t,"%Y-%m-%dT%H:%M:%S%:z")}function ur(t){return Tn.call(this,t,"%a, %d %b %Y %H:%M:%S %z")}function pr(t,e,n){return qi.call(this,t,"%b",e,n)}function hr(t,e,n){return qi.call(this,t,"%B",e,n)}function qi(t,e,n,i){let s=Fi(t,this.context.opts);if(!s)return t;let a=this.context.memoryLimit;if(n==="ordinal"){let r=s.getDate();return i==="US"?Pe(s,`${e} ${r}%q, %Y`,a):Pe(s,`${r}%q ${e} %Y`,a)}return Pe(s,`%d ${e} %Y`,a)}function Fi(t,e,n){let i,s=n??e.timezoneOffset,a=e.locale;if(t=m(t),!x(t))return t==="now"||t==="today"?i=new G(Date.now(),a,s):Fe(t)?i=new G(t*1e3,a,s):g(t)?/^\d+$/.test(t)?i=new G(+t*1e3,a,s):e.preserveTimezones&&n===void 0?i=G.createDateFixedToTimezone(t,a):i=new G(t,a,s):i=new G(t,a,s),i.valid()?i:void 0}var fr=Object.freeze({__proto__:null,date:Tn,date_to_xmlschema:dr,date_to_rfc822:ur,date_to_string:pr,date_to_long_string:hr}),_t=/[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/gu,si=/[^\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\s]+/gu;function mr(t,e){z(arguments.length===2,"append expect 2 arguments");let n=u(t),i=u(e);return this.context.memoryLimit.use(n.length+i.length),n+i}function gr(t,e){z(arguments.length===2,"prepend expect 2 arguments");let n=u(t),i=u(e);return this.context.memoryLimit.use(n.length+i.length),i+n}function Ci(t,e){let n=0;for(let i of t){if(!e.has(i))break;n+=i.length}return n}function Ai(t,e,n=0){let i=t.length;for(;i>n;){let s=i-n>=2&&t.codePointAt(i-2)>65535?2:1;if(!e.has(t.slice(i-s,i)))break;i-=s}return i}function _r(t,e){let n=u(t);return this.context.memoryLimit.use(n.length),e?(e=u(e),this.context.memoryLimit.use(e.length),n.slice(Ci(n,new Set(e)))):n.trimStart()}function br(t){let e=u(t);return this.context.memoryLimit.use(e.length),e.toLowerCase()}function yr(t){let e=u(t);return this.context.memoryLimit.use(e.length),u(e).toUpperCase()}function vr(t,e){let n=u(t);return e=u(e),this.context.memoryLimit.use(n.length+e.length),n.split(e).join("")}function wr(t,e){let n=u(t);return e=u(e),this.context.memoryLimit.use(n.length+e.length),n.replace(e,"")}function kr(t,e){let n=u(t),i=u(e);this.context.memoryLimit.use(n.length+i.length);let s=n.lastIndexOf(i);return s===-1?n:n.substring(0,s)+n.substring(s+i.length)}function xr(t,e){return t=u(t),this.context.memoryLimit.use(t.length),e?(e=u(e),this.context.memoryLimit.use(e.length),t.slice(0,Ai(t,new Set(e)))):t.trimEnd()}function Sr(t,e){let n=u(t);this.context.memoryLimit.use(n.length);let i=n.split(u(e));for(;i.length&&i[i.length-1]==="";)i.pop();return i}function Tr(t,e){let n=u(t);if(this.context.memoryLimit.use(n.length),e){let i=new Set(u(e));this.context.memoryLimit.use(i.size);let s=Ci(n,i);return n.slice(s,Ai(n,i,s))}return n.trim()}function zr(t){let e=u(t);return this.context.memoryLimit.use(e.length),e.replace(/\r?\n/gm,"")}function jr(t){let e=u(t);return this.context.memoryLimit.use(e.length),e.replace(/\s+/g," ").trim()}function Lr(t){return t=u(t),this.context.memoryLimit.use(t.length),t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()}function Or(t,e,n){let i=u(t);e=u(e),n=u(n);let s=i.split(e),a=i.length+(s.length-1)*(n.length-e.length);return this.context.memoryLimit.use(a),s.join(n)}function qr(t,e,n){let i=u(t);return e=u(e),n=u(n),this.context.memoryLimit.use(i.length+e.length+n.length),i.replace(e,()=>n)}function Fr(t,e,n){let i=u(t),s=u(e),a=u(n);this.context.memoryLimit.use(i.length+s.length+a.length);let r=i.lastIndexOf(s);return r===-1?i:i.substring(0,r)+a+i.substring(r+s.length)}function Cr(t,e=50,n="..."){let i=u(t);return n=u(n),this.context.memoryLimit.use(i.length+n.length),i.length<=e?t:i.substring(0,e-n.length)+n}function Ar(t,e=15,n="..."){let i=u(t);n=u(n),this.context.memoryLimit.use(i.length+n.length);let s=i.trimStart().split(/\s+/);e<=0&&(e=1);let a=s.slice(0,e).join(" ");return s.length>=e&&(a+=n),a}function Rr(t){let e=u(t);return this.context.memoryLimit.use(e.length),e.replace(/\s+/g," ")}function Mr(t,e){let n=u(t);if(this.context.memoryLimit.use(n.length),t=n.trim(),!t)return 0;switch(e){case"cjk":return(t.match(_t)||[]).length+(t.match(si)||[]).length;case"auto":return _t.test(t)?t.match(_t).length+(t.match(si)||[]).length:t.split(/\s+/).length;default:return t.split(/\s+/).length}}function Er(t,e="and"){e=u(e);let n=e.length+t.length*2;for(let i=0;i<t.length;i++)n+=u(t[i]).length;switch(this.context.memoryLimit.use(n),t.length){case 0:return"";case 1:return t[0];case 2:return`${t[0]} ${e} ${t[1]}`;default:return`${t.slice(0,-1).join(", ")}, ${e} ${t[t.length-1]}`}}var Pr=Object.freeze({__proto__:null,append:mr,prepend:gr,lstrip:_r,downcase:br,upcase:yr,remove:vr,remove_first:wr,remove_last:kr,rstrip:xr,split:Sr,strip:Tr,strip_newlines:zr,squish:jr,capitalize:Lr,replace:Or,replace_first:qr,replace_last:Fr,truncate:Cr,truncatewords:Ar,normalize_whitespace:Rr,number_of_words:Mr,array_to_sentence_string:Er});function Dr(t){let e=new TextEncoder().encode(t),n="";for(let i=0;i<e.length;i+=32768)n+=String.fromCharCode(...e.subarray(i,i+32768));return btoa(n)}function $r(t){return new TextDecoder().decode(Uint8Array.from(atob(t),e=>e.charCodeAt(0)))}function Nr(t){if(typeof Buffer<"u"&&Buffer.isBuffer(t))return this.context.memoryLimit.use(t.byteLength),t.toString("base64");let e=u(t);return this.context.memoryLimit.use(e.length),Dr(e)}function Br(t){let e=u(t);return this.context.memoryLimit.use(e.length),$r(e)}var Ir=Object.freeze({__proto__:null,base64_encode:Nr,base64_decode:Br});function Ri(t){let e=new Uint8Array(t),n="";for(let i=0;i<e.length;i++)n+=e[i].toString(16).padStart(2,"0");return n}function Vr(t){return w(this,void 0,void 0,function*(){let e=new TextEncoder().encode(t),n=yield crypto.subtle.digest("SHA-256",e);return Ri(n)})}function Hr(t,e){return w(this,void 0,void 0,function*(){let n=new TextEncoder,i=yield crypto.subtle.importKey("raw",n.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),s=yield crypto.subtle.sign("HMAC",i,n.encode(t));return Ri(s)})}function Ur(t){let e=u(t);return this.context.memoryLimit.use(e.length),Vr(e)}function Wr(t,e){let n=u(t),i=u(e);return this.context.memoryLimit.use(n.length+i.length),Hr(n,i)}var Jr=Object.freeze({__proto__:null,sha256:Ur,hmac_sha256:Wr}),Yr=Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},ea),Ta),Aa),cr),fr),Pr),Ir),Jr),vi),Kt=class extends b{constructor(e,n,i){super(e,n,i),this.identifier=this.tokenizer.readIdentifier(),this.key=this.identifier.content,this.tokenizer.assert(this.key,"expected variable name"),this.tokenizer.skipBlank(),this.tokenizer.assert(this.tokenizer.peek()==="=",'expected "="'),this.tokenizer.advance(),this.value=new F(this.tokenizer.readFilteredValue(),this.liquid)}*render(e){e.bottom()[this.key]=yield this.value.value(e,this.liquid.options.lenientIf)}*arguments(){yield this.value}*localScope(){yield this.identifier}},ai=["offset","limit","reversed"],Xt=class extends b{constructor(e,n,i,s){super(e,n,i);let a=this.tokenizer.readIdentifier(),r=this.tokenizer.readIdentifier(),o=this.tokenizer.readValue();if(!a.size()||r.content!=="in"||!o)throw new Error(`illegal tag: ${e.getText()}`);this.variable=a.content,this.collection=o,this.hash=new E(this.tokenizer,i.options.keyValueSeparator),this.templates=[],this.elseTemplates=[];let l,c=s.parseStream(n).on("start",()=>l=this.templates).on("tag:else",d=>{Be(d.args),l=this.elseTemplates}).on("tag:endfor",d=>{Be(d.args),c.stop()}).on("template",d=>l.push(d)).on("end",()=>{throw new Error(`tag ${e.getText()} not closed`)});c.start()}*render(e,n){let i=this.liquid.renderer,s=qe(yield j(this.collection,e));if(!s.length){yield i.renderTemplates(this.elseTemplates,e,n);return}let a="continue-"+this.variable+"-"+this.collection.getText();e.push(X({continue:e.getRegister(a,{})}));let r=yield this.hash.render(e);e.pop(),s=(this.liquid.options.orderedFilterParameters?Object.keys(r).filter(c=>ai.includes(c)):ai.filter(c=>r[c]!==void 0)).reduce((c,d)=>d==="offset"?Kr(c,r.offset):d==="limit"?Xr(c,r.limit):Gr(c),s),e.setRegister(a,(r.offset||0)+s.length);let l=X({forloop:new Se(s.length,this.collection.getText(),this.variable)});e.push(l);for(let c of s){if(l[this.variable]=c,e.continueCalled=e.breakCalled=!1,yield i.renderTemplates(this.templates,e,n),e.breakCalled)break;l.forloop.next()}e.continueCalled=e.breakCalled=!1,e.pop()}*children(){let e=this.templates.slice();return this.elseTemplates&&e.push(...this.elseTemplates),e}*arguments(){yield this.collection;for(let e of Object.values(this.hash.hash))O(e)&&(yield e)}blockScope(){return[this.variable,"forloop"]}};function Gr(t){return[...t].reverse()}function Kr(t,e){return t.slice(e)}function Xr(t,e){return t.slice(0,e)}var Zt=class extends b{constructor(e,n,i,s){for(super(e,n,i),this.templates=[],this.identifier=this.readVariable(),this.variable=this.identifier.content;n.length;){let a=n.shift();if(re(a)&&a.name==="endcapture")return;this.templates.push(s.parseToken(a,n))}throw new Error(`tag ${e.getText()} not closed`)}readVariable(){let e=this.tokenizer.readIdentifier();if(e.content||(e=this.tokenizer.readQuoted(),e))return e;throw this.tokenizer.error("invalid capture name")}*render(e){let i=yield this.liquid.renderer.renderTemplates(this.templates,e);e.bottom()[this.variable]=i}*children(){return this.templates}*localScope(){yield this.identifier}},Qt=class extends b{constructor(e,n,i,s){super(e,n,i),this.branches=[],this.elseTemplates=[],this.value=new F(this.tokenizer.readFilteredValue(),this.liquid),this.elseTemplates=[];let a=[],r=0,o=s.parseStream(n).on("tag:when",l=>{if(r>0)return;a=[];let c=[];for(;!l.tokenizer.end();)c.push(l.tokenizer.readValueOrThrow()),l.tokenizer.skipBlank(),l.tokenizer.peek()===","?l.tokenizer.readTo(","):l.tokenizer.readTo("or");this.branches.push({values:c,templates:a})}).on("tag:else",()=>{r++,a=this.elseTemplates}).on("tag:endcase",()=>o.stop()).on("template",l=>{(a!==this.elseTemplates||r===1)&&a.push(l)}).on("end",()=>{throw new Error(`tag ${e.getText()} not closed`)});o.start()}*render(e,n){let i=this.liquid.renderer,s=yield m(yield this.value.value(e,e.opts.lenientIf)),a=!1;for(let r of this.branches)for(let o of r.values){let l=yield j(o,e,e.opts.lenientIf);if(yield K(s,l)){yield i.renderTemplates(r.templates,e,n),a=!0;break}}a||(yield i.renderTemplates(this.elseTemplates,e,n))}*arguments(){yield this.value,yield*this.branches.flatMap(e=>e.values)}*children(){let e=this.branches.flatMap(n=>n.templates);return this.elseTemplates&&e.push(...this.elseTemplates),e}},en=class extends b{constructor(e,n,i){for(super(e,n,i);n.length;){let s=n.shift();if(re(s)&&s.name==="endcomment")return}throw new Error(`tag ${e.getText()} not closed`)}render(){}},tn=class extends b{constructor(e,n,i,s){super(e,n,i);let a=this.tokenizer;for(this.file=zn(a,this.liquid,s),this.currentFile=e.file;!a.end();){a.skipBlank();let r=a.p,o=a.readIdentifier();if((o.content==="with"||o.content==="for")&&(a.skipBlank(),a.peek()!==":")){let l=a.readValue();if(l){let c=a.p,d=a.readIdentifier(),p;d.content==="as"?p=a.readIdentifier():a.p=c;let h={value:l,alias:p&&p.content};o.content==="with"?this.with=h:this.forBinding=h,a.skipBlank(),a.peek()===","&&a.advance();continue}}a.p=r;break}this.hash=new E(a,i.options.keyValueSeparator)}*render(e,n){let{liquid:i,hash:s}=this,a=yield jn(this.file,e,i);z(a,()=>`illegal file path "${a}"`);let r=e.spawn(),o=r.bottom();if(He(o,yield s.render(e)),this.with){let{value:l,alias:c}=this.with;o[c||a]=yield j(l,e)}if(this.forBinding){let{value:l,alias:c}=this.forBinding,d=qe(yield j(l,e));o.forloop=new Se(d.length,l.getText(),c);for(let p of d){o[c]=p;let h=yield i._parsePartialFile(a,r.sync,this.currentFile);yield i.renderer.renderTemplates(h,r,n),o.forloop.next()}}else{let l=yield i._parsePartialFile(a,r.sync,this.currentFile);yield i.renderer.renderTemplates(l,r,n)}}*children(e,n){return e&&g(this.file)?yield this.liquid._parsePartialFile(this.file,n,this.currentFile):[]}partialScope(){if(g(this.file)){let e=Object.keys(this.hash.hash);if(this.with){let{value:n,alias:i}=this.with;g(i)?e.push([i,n]):g(this.file)&&e.push([this.file,n])}if(this.forBinding){let{value:n,alias:i}=this.forBinding;g(i)?e.push([i,n]):g(this.file)&&e.push([this.file,n])}return{name:this.file,isolated:!0,scope:e}}}*arguments(){for(let e of Object.values(this.hash.hash))O(e)&&(yield e);if(this.with){let{value:e}=this.with;O(e)&&(yield e)}if(this.forBinding){let{value:e}=this.forBinding;O(e)&&(yield e)}}};function zn(t,e,n){if(e.options.dynamicPartials){let a=t.readValue();if(t.assert(a,"illegal file path"),a.getText()==="none")return;if(Gt(a)){let r=n.parse(qs(a));return ri(r)}return a}let i=[...t.readFileNameTemplate(e.options)],s=ri(n.parseTokens(i));return s==="none"?void 0:s}function ri(t){return t.length===1&&vn(t[0].token)?t[0].token.getContent():t}function*jn(t,e,n){return typeof t=="string"?t:Array.isArray(t)?n.renderer.renderTemplates(t,e):yield j(t,e)}var nn=class extends b{constructor(e,n,i,s){super(e,n,i);let{tokenizer:a}=e;this.file=zn(a,this.liquid,s),this.currentFile=e.file;let r=a.p;a.readIdentifier().content==="with"?(a.skipBlank(),a.peek()!==":"?this.withVar=a.readValue():a.p=r):a.p=r,this.hash=new E(a,i.options.jekyllInclude||i.options.keyValueSeparator)}*render(e,n){let{liquid:i,hash:s,withVar:a}=this,{renderer:r}=i,o=yield jn(this.file,e,i);z(o,()=>`illegal file path "${o}"`);let l=e.saveRegister("blocks","blockMode");e.setRegister("blocks",{}),e.setRegister("blockMode",se.OUTPUT);let c=X(yield s.render(e));a&&(c[o]=yield j(a,e));let d=yield i._parsePartialFile(o,e.sync,this.currentFile);e.push(e.opts.jekyllInclude?X({include:c}):c),yield r.renderTemplates(d,e,n),e.pop(),e.restoreRegister(l)}*children(e,n){return e&&g(this.file)?yield this.liquid._parsePartialFile(this.file,n,this.currentFile):[]}partialScope(){if(g(this.file)){let e;return this.liquid.options.jekyllInclude?e=["include"]:(e=Object.keys(this.hash.hash),this.withVar&&e.push([this.file,this.withVar])),{name:this.file,isolated:!1,scope:e}}}*arguments(){yield*Object.values(this.hash.hash).filter(O),O(this.file)&&(yield this.file),O(this.withVar)&&(yield this.withVar)}},sn=class extends b{constructor(e,n,i){super(e,n,i),this.identifier=this.tokenizer.readIdentifier(),this.variable=this.identifier.content}render(e,n){let i=e.environments;Fe(i[this.variable])||(i[this.variable]=0),n.write(u(--i[this.variable]))}*localScope(){yield this.identifier}},an=class extends b{constructor(e,n,i){super(e,n,i),this.candidates=[];let s=this.tokenizer.readValue();for(this.tokenizer.skipBlank(),s&&(this.tokenizer.peek()===":"?(this.group=s,this.tokenizer.advance()):this.candidates.push(s));!this.tokenizer.end();){let a=this.tokenizer.readValue();a&&this.candidates.push(a),this.tokenizer.readTo(",")}this.tokenizer.assert(this.candidates.length,()=>`empty candidates: "${e.getText()}"`)}*render(e,n){let s=`cycle:${yield j(this.group,e)}:`+this.candidates.join(","),a=e.getRegister("cycle",{}),r=a[s];r===void 0&&(r=a[s]=0);let o=this.candidates[r];return r=(r+1)%this.candidates.length,a[s]=r,yield j(o,e)}*arguments(){yield*this.candidates,this.group&&(yield this.group)}},rn=class extends b{constructor(e,n,i,s){super(e,n,i),this.branches=[];let a=[];s.parseStream(n).on("start",()=>this.branches.push({value:new F(e.tokenizer.readFilteredValue(),this.liquid),templates:a=[]})).on("tag:elsif",r=>{z(!this.elseTemplates,"unexpected elsif after else"),this.branches.push({value:new F(r.tokenizer.readFilteredValue(),this.liquid),templates:a=[]})}).on("tag:else",r=>{Be(r.args),z(!this.elseTemplates,"duplicated else"),a=this.elseTemplates=[]}).on("tag:endif",function(r){Be(r.args),this.stop()}).on("template",r=>a.push(r)).on("end",()=>{throw new Error(`tag ${e.getText()} not closed`)}).start()}*render(e,n){let i=this.liquid.renderer;for(let{value:s,templates:a}of this.branches){let r=yield m(yield s.value(e,e.opts.lenientIf));if(ie(r,e)){yield i.renderTemplates(a,e,n);return}}yield i.renderTemplates(this.elseTemplates||[],e,n)}*children(){let e=this.branches.flatMap(n=>n.templates);return this.elseTemplates&&e.push(...this.elseTemplates),e}arguments(){return this.branches.map(e=>e.value)}},on=class extends b{constructor(e,n,i){super(e,n,i),this.identifier=this.tokenizer.readIdentifier(),this.variable=this.identifier.content}render(e,n){let i=e.environments;Fe(i[this.variable])||(i[this.variable]=0);let s=i[this.variable];i[this.variable]++,n.write(u(s))}*localScope(){yield this.identifier}},ln=class extends b{constructor(e,n,i,s){super(e,n,i),this.file=zn(this.tokenizer,this.liquid,s),this.currentFile=e.file,this.args=new E(this.tokenizer,i.options.keyValueSeparator),this.templates=s.parseTokens(n)}*render(e,n){let{liquid:i,args:s,file:a}=this,{renderer:r}=i;if(a===void 0){e.setRegister("blockMode",se.OUTPUT),yield r.renderTemplates(this.templates,e,n);return}let o=yield jn(this.file,e,i);z(o,()=>`illegal file path "${o}"`);let l=yield i._parseLayoutFile(o,e.sync,this.currentFile);e.setRegister("blockMode",se.STORE);let c=yield r.renderTemplates(this.templates,e),d=e.getRegister("blocks",{});d[""]===void 0&&(d[""]=(p,h)=>h.write(c)),e.setRegister("blockMode",se.OUTPUT),e.push(X(yield s.render(e))),yield r.renderTemplates(l,e,n),e.pop()}*children(e){let n=this.templates.slice();return e&&g(this.file)&&n.push(...yield this.liquid._parsePartialFile(this.file,!0,this.currentFile)),n}*arguments(){for(let e of Object.values(this.args.hash))O(e)&&(yield e);O(this.file)&&(yield this.file)}partialScope(){if(g(this.file))return{name:this.file,isolated:!1,scope:Object.keys(this.args.hash)}}},cn=class extends b{constructor(e,n,i,s){super(e,n,i),this.templates=[];let a=/\w+/.exec(e.args);for(this.block=a?a[0]:"";n.length;){let r=n.shift();if(re(r)&&r.name==="endblock")return;let o=s.parseToken(r,n);this.templates.push(o)}throw new Error(`tag ${e.getText()} not closed`)}*render(e,n){let i=this.getBlockRender(e);e.getRegister("blockMode")===se.STORE?e.getRegister("blocks",{})[this.block]=i:yield i(new Ve,n)}getBlockRender(e){let n=this,{liquid:i,templates:s}=this,a=e.getRegister("blocks",{})[this.block],r=function*(o,l){let c=e.getRegister("blockStack",[]);if(c.includes(n))throw new Error("block tag cannot be nested");c.push(n),e.push(X({block:o})),yield i.renderer.renderTemplates(s,e,l),e.pop(),c.pop()};return a?(o,l)=>a(new Ve(c=>r(o,c)),l):r}*children(){return this.templates}blockScope(){return["block"]}},dn=class extends b{constructor(e,n,i){for(super(e,n,i),this.tokens=[];n.length;){let s=n.shift();if(re(s)&&s.name==="endraw")return;this.tokens.push(s)}throw new Error(`tag ${e.getText()} not closed`)}render(){return this.tokens.map(e=>e.getText()).join("")}},un=class extends Se{constructor(e,n,i,s){super(e,i,s),this.length=e,this.cols=n}row(){return Math.floor(this.i/this.cols)+1}col0(){return this.i%this.cols}col(){return this.col0()+1}col_first(){return this.col0()===0}col_last(){return this.col()===this.cols}},pn=class extends b{constructor(e,n,i,s){super(e,n,i);let a=this.tokenizer.readIdentifier();this.tokenizer.skipBlank();let r=this.tokenizer.readIdentifier(),o=this.tokenizer.readValue();if(r.content!=="in"||!o)throw new Error(`illegal tag: ${e.getText()}`);this.variable=a.content,this.collection=o,this.args=new E(this.tokenizer,i.options.keyValueSeparator),this.templates=[];let l,c=s.parseStream(n).on("start",()=>l=this.templates).on("tag:endtablerow",()=>c.stop()).on("template",d=>l.push(d)).on("end",()=>{throw new Error(`tag ${e.getText()} not closed`)});c.start()}*render(e,n){let i=qe(yield j(this.collection,e)),s=yield this.args.render(e),a=s.offset||0,r=s.limit===void 0?i.length:s.limit;i=i.slice(a,a+r);let o=s.cols||i.length,l=this.liquid.renderer,c=new un(i.length,o,this.collection.getText(),this.variable),d=X({tablerowloop:c});e.push(d);for(let p=0;p<i.length;p++,c.next())d[this.variable]=i[p],c.col0()===0&&(c.row()!==1&&n.write("</tr>"),n.write(`<tr class="row${c.row()}">`)),n.write(`<td class="col${c.col()}">`),yield l.renderTemplates(this.templates,e,n),n.write("</td>");i.length&&n.write("</tr>"),e.pop()}*children(){return this.templates}*arguments(){yield this.collection;for(let e of Object.values(this.args.hash))O(e)&&(yield e)}blockScope(){return[this.variable,"tablerowloop"]}},hn=class extends b{constructor(e,n,i,s){super(e,n,i),this.branches=[],this.elseTemplates=[];let a=[],r=0;s.parseStream(n).on("start",()=>this.branches.push({value:new F(e.tokenizer.readFilteredValue(),this.liquid),test:at,templates:a=[]})).on("tag:elsif",o=>{if(r>0){a=[];return}this.branches.push({value:new F(o.tokenizer.readFilteredValue(),this.liquid),test:ie,templates:a=[]})}).on("tag:else",()=>{r++,a=this.elseTemplates}).on("tag:endunless",function(){this.stop()}).on("template",o=>{(a!==this.elseTemplates||r===1)&&a.push(o)}).on("end",()=>{throw new Error(`tag ${e.getText()} not closed`)}).start()}*render(e,n){let i=this.liquid.renderer;for(let{value:s,test:a,templates:r}of this.branches){let o=yield m(yield s.value(e,e.opts.lenientIf));if(a(o,e)){yield i.renderTemplates(r,e,n);return}}yield i.renderTemplates(this.elseTemplates,e,n)}*children(){let e=this.branches.flatMap(n=>n.templates);return this.elseTemplates&&e.push(...this.elseTemplates),e}arguments(){return this.branches.map(e=>e.value)}},fn=class extends b{render(e,n){e.breakCalled=!0}},mn=class extends b{render(e,n){e.continueCalled=!0}},gn=class extends b{constructor(e,n,i){super(e,n,i),this.tokenizer.skipBlank(),this.tokenizer.end()||(this.value=new F(this.tokenizer.readFilteredValue(),this.liquid))}*render(e,n){if(!this.value)return;let i=yield m(yield this.value.value(e,!1));n.write(i)}*arguments(){this.value&&(yield this.value)}},_n=class extends b{constructor(e,n,i,s){super(e,n,i);let a=this.tokenizer.readLiquidTagTokens(this.liquid.options);this.templates=s.parseTokens(a)}*render(e,n){yield this.liquid.renderer.renderTemplates(this.templates,e,n)}*children(){return this.templates}},bn=class extends b{constructor(e,n,i){if(super(e,n,i),e.args.search(/\n\s*[^#\s]/g)!==-1)throw new Error("every line of an inline comment must start with a '#' character")}render(){}},Zr={assign:Kt,for:Xt,capture:Zt,case:Qt,comment:en,include:nn,render:tn,decrement:sn,increment:on,cycle:an,if:rn,layout:ln,block:cn,raw:dn,tablerow:pn,unless:hn,break:fn,continue:mn,echo:gn,liquid:_n,"#":bn},tt=class t{constructor(e={}){this.renderer=new Nt,this.filters=Object.create(null),this.tags=Object.create(null),this.options=ta(e),this.parser=new B(this),Nn(Zr,(n,i)=>this.registerTag(i,n)),Nn(Yr,(n,i)=>this.registerFilter(i,n))}parse(e,n){return new B(this).parse(e,n)}_render(e,n,i){let s=n instanceof ne?n:new ne(n,this.options,i,{liquid:this});return this.renderer.renderTemplates(e,s)}render(e,n,i){return w(this,void 0,void 0,function*(){return I(this._render(e,n,Object.assign(Object.assign({},i),{sync:!1})))})}renderSync(e,n,i){return V(this._render(e,n,Object.assign(Object.assign({},i),{sync:!0})))}renderToNodeStream(e,n,i={}){let s=new ne(n,this.options,i,{liquid:this});return this.renderer.renderTemplatesToNodeStream(e,s)}_parseAndRender(e,n,i){let s=this.parse(e);return this._render(s,n,i)}parseAndRender(e,n,i){return w(this,void 0,void 0,function*(){return I(this._parseAndRender(e,n,Object.assign(Object.assign({},i),{sync:!1})))})}parseAndRenderSync(e,n,i){return V(this._parseAndRender(e,n,Object.assign(Object.assign({},i),{sync:!0})))}_parsePartialFile(e,n,i){return new B(this).parseFile(e,n,he.Partials,i)}_parseLayoutFile(e,n,i){return new B(this).parseFile(e,n,he.Layouts,i)}_parseFile(e,n,i,s){return new B(this).parseFile(e,n,i,s)}parseFile(e,n){return w(this,void 0,void 0,function*(){return I(new B(this).parseFile(e,!1,n))})}parseFileSync(e,n){return V(new B(this).parseFile(e,!0,n))}*_renderFile(e,n,i){let s=yield this._parseFile(e,i.sync,i.lookupType);return yield this._render(s,n,i)}renderFile(e,n,i){return w(this,void 0,void 0,function*(){return I(this._renderFile(e,n,Object.assign(Object.assign({},i),{sync:!1})))})}renderFileSync(e,n,i){return V(this._renderFile(e,n,Object.assign(Object.assign({},i),{sync:!0})))}renderFileToNodeStream(e,n,i){return w(this,void 0,void 0,function*(){let s=yield this.parseFile(e);return this.renderToNodeStream(s,n,i)})}_evalValue(e,n){let i=new F(e,this),s=n instanceof ne?n:new ne(n,this.options,{},{liquid:this});return i.value(s)}evalValue(e,n){return w(this,void 0,void 0,function*(){return I(this._evalValue(e,n))})}evalValueSync(e,n){return V(this._evalValue(e,n))}registerFilter(e,n){this.filters[e]=n}unregisterFilter(e){delete this.filters[e]}registerTag(e,n){this.tags[e]=S(n)?n:ra(n)}plugin(e){return e.call(this,t)}express(){let e=this,n=!0;return function(i,s,a){if(n){n=!1;let r=De(this.root);e.options.root.unshift(...r),e.options.layouts.unshift(...r),e.options.partials.unshift(...r)}e.renderFile(i,s).then(r=>a(null,r),a)}}analyze(e,n={}){return w(this,void 0,void 0,function*(){return J(e,n)})}analyzeSync(e,n={}){return Y(e,n)}parseAndAnalyze(e,n,i={}){return w(this,void 0,void 0,function*(){return J(this.parse(e,n),i)})}parseAndAnalyzeSync(e,n,i={}){return Y(this.parse(e,n),i)}variables(e,n={}){return w(this,void 0,void 0,function*(){let i=yield J(g(e)?this.parse(e):e,n);return Object.keys(i.variables)})}variablesSync(e,n={}){let i=Y(g(e)?this.parse(e):e,n);return Object.keys(i.variables)}fullVariables(e,n={}){return w(this,void 0,void 0,function*(){let i=yield J(g(e)?this.parse(e):e,n);return Array.from(new Set(Object.values(i.variables).flatMap(s=>s.map(a=>String(a)))))})}fullVariablesSync(e,n={}){let i=Y(g(e)?this.parse(e):e,n);return Array.from(new Set(Object.values(i.variables).flatMap(s=>s.map(a=>String(a)))))}variableSegments(e,n={}){return w(this,void 0,void 0,function*(){let i=yield J(g(e)?this.parse(e):e,n);return Array.from(Me(Object.values(i.variables).flatMap(s=>s.map(a=>a.toArray()))))})}variableSegmentsSync(e,n={}){let i=Y(g(e)?this.parse(e):e,n);return Array.from(Me(Object.values(i.variables).flatMap(s=>s.map(a=>a.toArray()))))}globalVariables(e,n={}){return w(this,void 0,void 0,function*(){let i=yield J(g(e)?this.parse(e):e,n);return Object.keys(i.globals)})}globalVariablesSync(e,n={}){let i=Y(g(e)?this.parse(e):e,n);return Object.keys(i.globals)}globalFullVariables(e,n={}){return w(this,void 0,void 0,function*(){let i=yield J(g(e)?this.parse(e):e,n);return Array.from(new Set(Object.values(i.globals).flatMap(s=>s.map(a=>String(a)))))})}globalFullVariablesSync(e,n={}){let i=Y(g(e)?this.parse(e):e,n);return Array.from(new Set(Object.values(i.globals).flatMap(s=>s.map(a=>String(a)))))}globalVariableSegments(e,n={}){return w(this,void 0,void 0,function*(){let i=yield J(g(e)?this.parse(e):e,n);return Array.from(Me(Object.values(i.globals).flatMap(s=>s.map(a=>a.toArray()))))})}globalVariableSegmentsSync(e,n={}){let i=Y(g(e)?this.parse(e):e,n);return Array.from(Me(Object.values(i.globals).flatMap(s=>s.map(a=>a.toArray()))))}};var ot=class extends tt{constructor(e={}){super({...e,fs:Dn})}};var Mi=new URL("..","file:///repo/preview/server.mjs"),Ln=JSON.parse(ce(new URL("ops/src/seed/catalog.json",Mi),"utf8")),Qr=new URL("design/out/",Mi),eo=1e3,Ce=()=>eo++;function fe(t,e="",n=1600,i=2e3){return{src:`/img/${t}`,width:n,height:i,aspect_ratio:n/i,alt:e,id:Ce()}}var On=class extends q{constructor(e,{available:n=!0,selected:i=!1}={}){super(),this.name=e,this.available=n,this.selected=i,this.swatch=null}valueOf(){return this.name}toString(){return this.name}},W=class extends q{constructor(e){super(),this.value=e}valueOf(){return typeof this.value=="string"?this.value:JSON.stringify(this.value)}toString(){return this.valueOf()}};function to(t){return Object.values(t).reduce((e,n)=>e.flatMap(i=>n.map(s=>[...i,s])),[[]])}var P=[],me={};for(let t of Ln.products){let e=Object.keys(t.options),n=e.length>0,i=[];for(let l of["front","back","detail"]){let c=`${t.handle}-${l}.png`;ye(new URL(c,Qr))&&i.push(fe(c,`${t.title}, ${l} view`))}let s={};t.colors&&Object.keys(t.colors).forEach((l,c)=>{if(c===0)return s[l]=i[0];let d=`${t.handle}-front-${l.toLowerCase()}.png`,p=fe(d,`${t.title} in ${l}`);i.push(p),s[l]=p}),i.forEach(l=>Object.assign(l,{media_type:"image",preview_image:l}));let a=to(t.options).map(l=>{let c=n?l.join(" / "):"Default Title",d=t.stock?.[c]??t.stockOverrides?.[c]??t.stockDefault??0,p=e.indexOf("Color")>=0?l[e.indexOf("Color")]:null;return{id:Ce(),title:c,options:n?l:["Default Title"],option1:l[0],price:t.price*100,compare_at_price:t.compareAt?t.compareAt*100:null,inventory_quantity:d,inventory_management:"shopify",inventory_policy:"deny",available:d>0,sku:`KALA-${t.drop_code}`,featured_media:p?s[p]:null}}),r=a.map(l=>l.price),o={id:Ce(),handle:t.handle,title:t.title,url:`/products/${t.handle}`,vendor:"Kala",type:t.type,description:t.description,available:a.some(l=>l.available),price:Math.min(...r),price_min:Math.min(...r),price_max:Math.max(...r),price_varies:new Set(r).size>1,compare_at_price_min:t.compareAt?t.compareAt*100:0,media:i,featured_media:i[0],featured_image:i[0],images:i,variants:a,has_only_default_variant:!n,options:n?e:["Title"],collection_handle:t.collection,pairs:t.pairs??[],metafields:{kala:{drop_code:new W(t.drop_code),fit_note:t.fit_note?new W(t.fit_note):null,material:t.material?new W(t.material):null,care:t.care?new W(t.care):null,origin:t.origin?new W(t.origin):null,size_chart:t.sizeChart?new W(Ln.sizeCharts[t.sizeChart]):null,complementary:null}},_colors:t.colors};P.push(o),me[t.handle]=o}for(let t of P)t.pairs.length&&(t.metafields.kala.complementary=new W(t.pairs.map(e=>me[e]).filter(Boolean)));function qn(t,e){let n=t.variants.find(a=>String(a.id)===String(e))??t.variants.find(a=>a.available)??t.variants[0],s=(t.has_only_default_variant?["Title"]:t.options).map((a,r)=>{let o=[...new Set(t.variants.map(l=>l.options[r]))].map(l=>{let c=t.variants.some(p=>p.available&&p.options[r]===l&&p.options.every((h,_)=>_===r||h===n.options[_])),d=new On(l,{available:c,selected:n.options[r]===l});return t._colors&&a==="Color"&&(d.swatch={color:t._colors[l]}),d});return{name:a,position:r+1,values:o,selected_value:n.options[r]}});return{...t,selected_or_first_available_variant:n,selected_variant:n,options_with_values:s,collections:[Z[t.collection_handle]]}}var Z={};for(let t of Ln.collections){let e=P.filter(i=>i.collection_handle===t.handle),n=`knolling-${t.handle.split("-")[1]}.png`;Z[t.handle]={id:Ce(),handle:t.handle,title:t.title,url:`/collections/${t.handle}`,description:t.description,image:fe(n,t.title),featured_image:fe(n,t.title),products:e,products_count:e.length}}Z.all={id:Ce(),handle:"all",title:"All products",url:"/collections/all",description:"",products:P,products_count:P.length};var Ei={"hero-07.png":fe("hero-07.png","Kemeja Kerja technical drawing",1600,1800),"look-07.png":fe("look-07.png","Look 07 flat-lay",1600,1200)},Pi={"main-menu":{links:[{title:"Drop 07",url:"/collections/drop-07-kemarau"},{title:"Shop all",url:"/collections/all"},{title:"Archive",url:"/collections"},{title:"Journal",url:"/blogs/journal"}]},footer:{links:[{title:"Shipping",url:"/pages/shipping"},{title:"Returns & exchanges",url:"/pages/returns"},{title:"Size guide",url:"/pages/size-guide"},{title:"Contact",url:"/pages/contact"}]}};var Ni=new URL("..","file:///repo/preview/server.mjs"),oe=new URL("theme/",Ni),ut=Number(process.env.PORT||9393),pt=t=>Re(new URL(t,oe),"utf8"),no=JSON.parse(ce(new URL("locales/en.default.json",oe),"utf8")),io=JSON.parse(ce(new URL("config/settings_schema.json",oe),"utf8")),Cn=class extends q{constructor(e){super(),this.hex=e;let n=parseInt(e.slice(1),16);this.red=n>>16&255,this.green=n>>8&255,this.blue=n&255}valueOf(){return this.hex}toString(){return this.hex}};function so(t,e){if(e==null||e==="")return null;switch(t){case"color":return new Cn(e);case"collection":return Z[e]??null;case"product":return me[e]?qn(me[e]):null;case"image_picker":return Ei[String(e).replace("shopify://shop_images/","")]??null;case"link_list":return Pi[e]??{links:[]};case"url":return String(e).replace("shopify://collections/","/collections/").replace("shopify://products/","/products/");default:return e}}function An(t=[],e={}){let n={};for(let i of t)i.id&&(n[i.id]=so(i.type,e[i.id]??i.default));return n}var ao=An(io.flatMap(t=>t.settings??[]),JSON.parse(ce(new URL("config/settings_data.json",oe),"utf8")).presets.Default),Bi=t=>new Intl.NumberFormat("id-ID",{maximumFractionDigits:0}).format(Math.round(Number(t)/100)),Fn=t=>`Rp ${Bi(t)}`,ct=t=>Object.fromEntries(t.filter(Array.isArray));function ro(t,e){let n=ct(e),i=t.split(".").reduce((s,a)=>s?.[a],no);return i&&typeof i=="object"&&(i=n.count===1?i.one:i.other),typeof i!="string"?`translation missing: ${t}`:i.replace(/\{\{\s*(\w+)\s*\}\}/g,(s,a)=>(n[a]??"").toString())}var Q=new ot({root:Di(oe),partials:Di(new URL("snippets/",oe)),extname:".liquid",strictFilters:!0,jsTruthy:!1});function Di(t){return decodeURIComponent(t.pathname)}var Rn=class{constructor(e,n){this.img=e,this.width=n}toString(){return`${this.img.src}${this.width?`?width=${this.width}`:""}`}},oo={t:(t,...e)=>ro(t,e),money:Fn,money_with_currency:t=>`${Fn(t)} IDR`,money_without_trailing_zeros:Fn,money_without_currency:Bi,asset_url:t=>`/assets/${t}`,stylesheet_tag:t=>`<link href="${t}" rel="stylesheet" type="text/css" media="all">`,preload_tag:(t,...e)=>{let n=ct(e);return`<link href="${t}" rel="preload" as="${n.as}" type="${n.type??""}" crossorigin="${n.crossorigin??""}">`},image_url:(t,...e)=>{if(!t)return"";let n=t.preview_image??t;return new Rn(n,ct(e).width)},image_tag:(t,...e)=>{if(!t)return"";let n=ct(e),i=t.img??{},s={src:String(t),alt:n.alt??i.alt??"",width:i.width,height:i.height};n.widths&&(s.srcset=String(n.widths).split(",").map(a=>`${i.src}?width=${a.trim()} ${a.trim()}w`).join(", "));for(let[a,r]of Object.entries(n))["widths","preload","alt"].includes(a)||(s[a]=r);return`<img ${Object.entries(s).filter(([,a])=>a!=null).map(([a,r])=>`${a}="${String(r).replace(/"/g,"&quot;")}"`).join(" ")}>`},placeholder_svg_tag:(t,e="")=>`<svg class="${e}" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><rect width="400" height="500"/></svg>`,structured_data:()=>"{}",payment_button:()=>"",default_pagination:()=>"",default_errors:()=>"",video_tag:()=>"",external_video_tag:()=>"",handle:t=>String(t??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")};for(let[t,e]of Object.entries(oo))Q.registerFilter(t,e);Q.registerTag("schema",class extends b{constructor(t,e,n){for(super(t,e,n);e.length;)if(e.shift().name==="endschema")return}*render(){}});var lo={product:"/cart/add",customer:"/contact#footer-signup",localization:"/localization",storefront_password:"/password"};Q.registerTag("form",class extends b{constructor(t,e,n){super(t,e,n);let i=t.args.match(/^\s*'([^']+)'\s*(?:,\s*([a-z_.]+)(?=\s*(?:,|$)))?\s*,?(.*)$/s);this.type=i[1],this.hash=new E(i[3]??""),this.tpls=[];let s=n.parser.parseStream(e).on("tag:endform",()=>s.stop()).on("template",a=>this.tpls.push(a)).on("end",()=>{throw new Error("form not closed")});s.start()}*render(t,e){let n=yield this.hash.render(t),i=Object.entries(n).map(([s,a])=>`${s}="${a}"`).join(" ");e.write(`<form method="post" action="${lo[this.type]??"/"}" accept-charset="UTF-8" ${i}><input type="hidden" name="form_type" value="${this.type}">`),t.push({form:{errors:null,"posted_successfully?":!1}}),yield this.liquid.renderer.renderTemplates(this.tpls,t,e),t.pop(),e.write("</form>")}});Q.registerTag("paginate",class extends b{constructor(t,e,n){super(t,e,n);let i=t.args.match(/^\s*([\w.]+)\s+by\s+([\w.]+)/);this.collectionPath=i[1],this.tpls=[];let s=n.parser.parseStream(e).on("tag:endpaginate",()=>s.stop()).on("template",a=>this.tpls.push(a));s.start()}*render(t,e){let i=(yield this.liquid.evalValue(this.collectionPath,t))?.length??0;t.push({paginate:{current_page:1,current_offset:0,items:i,pages:1,next:null,previous:null}}),yield this.liquid.renderer.renderTemplates(this.tpls,t,e),t.pop()}});async function co(t){let e=await pt(`sections/${t}.liquid`),n=e.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/),i=n?JSON.parse(n[1]):{};return{src:e,schema:i}}async function _e(t,e={},n=t,i,s=1){let{src:a,schema:r}=await co(t),o=Object.fromEntries((r.blocks??[]).map(_=>[_.type,_])),c=(e.block_order??Object.keys(e.blocks??{})).map(_=>{let f=e.blocks[_];return{id:_,type:f.type,settings:An(o[f.type]?.settings,f.settings),shopify_attributes:""}}),d={id:n,index:s,settings:An(r.settings,e.settings),blocks:c},p=await Q.parseAndRender(a,{section:d},{globals:i}),h=r.tag??"div";return`<${h} id="shopify-section-${n}" class="shopify-section ${r.class??""}">${p}</${h}>`}async function uo(t,e){let n=JSON.parse(await pt(`sections/${t}.json`)),i="";for(let s of n.order)i+=await _e(n.sections[s].type,n.sections[s],`sections--1__${s}`,e);return i}Q.registerTag("sections",class extends b{constructor(t,e,n){super(t,e,n),this.name=t.args.trim().replace(/['"]/g,"")}*render(t,e){e.write(yield uo(this.name,t.getAll()))}});Q.registerTag("section",class extends b{constructor(t,e,n){super(t,e,n),this.name=t.args.trim().replace(/['"]/g,"")}*render(t,e){e.write(yield _e(this.name,{},this.name,t.getAll()))}});var ft=new Map;for(let t of P)for(let e of t.variants)ft.set(String(e.id),{product:t,variant:e});var ge=[],dt="";function Ii(){let t=ge.map((n,i)=>{let{product:s,variant:a}=ft.get(String(n.id)),r=s.has_only_default_variant?["Title"]:s.options;return{key:`${a.id}:${i}`,id:a.id,url:`${s.url}?variant=${a.id}`,image:a.featured_media??s.featured_media,product:s,variant:a,quantity:n.quantity,options_with_values:r.map((o,l)=>({name:o,value:a.options[l]})),properties:{},line_level_discount_allocations:[],original_line_price:(a.compare_at_price??a.price)*n.quantity,final_line_price:a.price*n.quantity}}),e=t.reduce((n,i)=>n+i.final_line_price,0);return{items:t,item_count:t.reduce((n,i)=>n+i.quantity,0),total_price:e,note:dt,currency:{iso_code:"IDR",symbol:"Rp"},cart_level_discount_applications:[]}}function po(t,e=1){let n=ft.get(String(t));if(!n)throw Object.assign(new Error("Variant not found"),{status:404});let i=ge.find(a=>String(a.id)===String(t)),s=(i?.quantity??0)+e;if(s>n.variant.inventory_quantity)throw Object.assign(new Error(`You can only add ${n.variant.inventory_quantity} of ${n.product.title} to the cart.`),{status:422});i?i.quantity=s:ge.push({id:Number(t),quantity:e})}var Vi=[{value:"manual",name:"Featured"},{value:"price-ascending",name:"Price, low to high"},{value:"price-descending",name:"Price, high to low"},{value:"title-ascending",name:"Alphabetically, A\u2013Z"}];function ho(t,e){let n=e.getAll("filter.v.option.size"),i=e.get("filter.v.availability")==="1",s=e.get("filter.v.price.gte"),a=e.get("filter.v.price.lte"),r=e.get("sort_by")||"manual",o=`${t.url}`,l=(f,k)=>{let A=new URLSearchParams(e),mt=A.getAll(f).filter(le=>k===void 0||le!==k);return A.delete(f),mt.forEach(le=>A.append(f,le)),`${o}?${A}`},c=t.products.filter(f=>!(i&&!f.available||n.length&&!f.variants.some(k=>k.options.some(A=>n.includes(A)))||s&&f.price_min<Number(s)*100||a&&f.price_min>Number(a)*100));r==="price-ascending"&&(c=[...c].sort((f,k)=>f.price_min-k.price_min)),r==="price-descending"&&(c=[...c].sort((f,k)=>k.price_min-f.price_min)),r==="title-ascending"&&(c=[...c].sort((f,k)=>f.title.localeCompare(k.title)));let p=[...new Set(t.products.flatMap(f=>f.options.includes("Size")?f.variants.map(k=>k.options[f.options.indexOf("Size")]):[]))].map(f=>({label:f,value:f,param_name:"filter.v.option.size",count:t.products.filter(k=>k.variants.some(A=>A.available&&A.options.includes(f))).length,active:n.includes(f),url_to_remove:l("filter.v.option.size",f)})),h={label:"In stock",value:"1",param_name:"filter.v.availability",count:t.products.filter(f=>f.available).length,active:i,url_to_remove:l("filter.v.availability")},_=[{label:"Availability",type:"boolean",param_name:"filter.v.availability",values:[h],active_values:i?[h]:[]},{label:"Size",type:"list",presentation:"text",param_name:"filter.v.option.size",values:p,active_values:p.filter(f=>f.active)},{label:"Price",type:"price_range",param_name:"filter.v.price",min_value:{param_name:"filter.v.price.gte",value:s?Number(s)*100:null},max_value:{param_name:"filter.v.price.lte",value:a?Number(a)*100:null},range_max:Math.max(...t.products.map(f=>f.price_max)),active_values:[],url_to_remove:(()=>{let f=new URLSearchParams(e);return f.delete("filter.v.price.gte"),f.delete("filter.v.price.lte"),`${o}?${f}`})()}];return{...t,products:c,products_count:c.length,filters:_,sort_options:Vi,sort_by:r,default_sort_by:"manual"}}var fo={root_url:"/",cart_url:"/cart",cart_add_url:"/cart/add",cart_change_url:"/cart/change",search_url:"/search",predictive_search_url:"/search/suggest",product_recommendations_url:"/recommendations/products",all_products_collection_url:"/collections/all",account_url:"/account",collections_url:"/collections"};function ht(t,e={}){return{settings:ao,shop:{name:"Kala",currency:"IDR",customer_accounts_enabled:!0,description:"Small-run clothing from Bandung.",password_message:""},cart:Ii(),routes:fo,request:{locale:{iso_code:"en"},page_type:e.template?.name??"index",design_mode:!1,origin:`http://localhost:${ut}`},localization:{country:{iso_code:"ID"},available_countries:[{iso_code:"ID",name:"Indonesia",currency:{iso_code:"IDR"}},{iso_code:"SG",name:"Singapore",currency:{iso_code:"SGD"}},{iso_code:"MY",name:"Malaysia",currency:{iso_code:"MYR"}}]},canonical_url:t.href,page_title:e.page_title??"Kala",page_description:"Small-run clothing from Bandung.",content_for_header:'<script>window.Shopify = { analytics: { publish(n, d) { console.log("[analytics]", n, d) } } }<\/script>',current_page:1,collections:Object.values(Z).filter(n=>n.handle!=="all"),...e}}async function D(t,e,n={}){let i=JSON.parse(await pt(`templates/${t}.json`)),s=ht(e,{template:{name:t},...n}),a=e.searchParams.get("section_id"),r="",o=0;for(let c of i.order){let d=`template--1__${c}`;a&&a!==d||(r+=await _e(i.sections[c].type,i.sections[c],d,s,++o))}if(a)return r;let l=await pt(`layout/${i.layout??"theme"}.liquid`);return Q.parseAndRender(l,{},{globals:{...s,content_for_layout:r}})}async function $i(t,e){let n={};for(let i of t)i==="cart-drawer"?n[i]=await _e("cart-drawer",{},"cart-drawer",ht(e)):i.startsWith("template--1__")&&(n[i]=await D("cart",new URL(`/cart?section_id=${i}`,e)));return n}var mo={".css":"text/css",".js":"text/javascript",".png":"image/png",".woff2":"font/woff2",".svg":"image/svg+xml"};async function lt(t){let e=[];for await(let i of t)e.push(i);let n=Buffer.concat(e).toString();if((t.headers["content-type"]||"").includes("application/json"))return JSON.parse(n||"{}");if((t.headers["content-type"]||"").includes("multipart/form-data")){let i={};for(let s of n.split(/------\S+/)){let a=s.match(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/);a&&(i[a[1]]=a[2])}return i}return Object.fromEntries(new URLSearchParams(n))}var go=Pn(async(t,e)=>{let n=new URL(t.url,`http://localhost:${ut}`),i=n.pathname,s=(r,o,l="text/html; charset=utf-8")=>{e.writeHead(r,{"Content-Type":l}),e.end(o)},a=(r,o)=>s(r,JSON.stringify(o),"application/json");try{if(i==="/favicon.ico")return s(204,"");if(i.startsWith("/assets/")){let o=new URL(`assets/${i.slice(8)}`,oe);return ye(o)?s(200,await Re(o),mo[En(i)]):s(404,"not found")}if(i.startsWith("/img/")){let o=new URL(`design/out/${i.slice(5)}`,Ni);return ye(o)?s(200,await Re(o),"image/png"):s(404,"not found")}if(t.method==="POST"&&i==="/cart/add.js"){let o=await lt(t),l=o.items??[{id:o.id,quantity:Number(o.quantity||1)}];try{l.forEach(d=>po(d.id,Number(d.quantity||1)))}catch(d){return a(d.status??422,{status:d.status??422,message:"Cart Error",description:d.message})}let c=Array.isArray(o.sections)?o.sections:String(o.sections||"").split(",").filter(Boolean);return a(200,{items:l,sections:await $i(c,n)})}if(t.method==="POST"&&i==="/cart/change.js"){let o=await lt(t),l=Number(o.line)-1;if(o.quantity===0)ge.splice(l,1);else{let{variant:d}=ft.get(String(ge[l].id));if(o.quantity>d.inventory_quantity)return a(422,{status:422,message:"Cart Error",description:`Only ${d.inventory_quantity} left.`});ge[l].quantity=o.quantity}let c=Ii();return a(200,{item_count:c.item_count,total_price:c.total_price,sections:await $i(o.sections??[],n)})}if(t.method==="POST"&&i==="/cart/update.js")return dt=(await lt(t)).note??dt,a(200,{note:dt});if(t.method==="POST"&&i==="/apps/kala/back-in-stock"){let o=await lt(t);return/@/.test(o.email??"")?a(201,{message:`Noted. We'll email ${o.email} once if it comes back.`}):a(422,{error:"Please enter a valid email."})}if(i==="/search/suggest"){let o=(n.searchParams.get("q")||"").toLowerCase(),l=P.filter(d=>d.title.toLowerCase().includes(o)||d.type.toLowerCase().includes(o)),c=await _e("predictive-search",{},"predictive-search",{...ht(n),predictive_search:{performed:!0,terms:n.searchParams.get("q"),resources:{products:l.slice(0,6),collections:Object.values(Z).filter(d=>d.title.toLowerCase().includes(o)),queries:o?[{text:o,styled_text:`<mark>${o}</mark>`,url:`/search?q=${o}`}]:[]}}});return s(200,c)}if(i==="/recommendations/products"){let o=P.find(d=>String(d.id)===n.searchParams.get("product_id")),l=P.filter(d=>d!==o&&d.collection_handle===o?.collection_handle&&d.available).slice(0,4),c=await _e("product-recommendations",{settings:{}},n.searchParams.get("section_id"),{...ht(n),product:o,recommendations:{performed:!0,products:l,products_count:l.length}});return s(200,c)}let r;if(i==="/"||i==="")return s(200,await D("index",n));if(i==="/password")return s(200,await D("password",n,{template:{name:"password"}}));if(r=i.match(/^\/products\/([\w-]+)/)){let o=me[r[1]];if(!o)return s(404,await D("404",n));let l=qn(o,n.searchParams.get("variant"));return s(200,await D("product",n,{product:l,page_title:o.title,template:{name:"product"}}))}if(i==="/collections")return s(200,await D("list-collections",n,{template:{name:"list-collections"}}));if(r=i.match(/^\/collections\/([\w-]+)/)){let o=Z[r[1]];if(!o)return s(404,await D("404",n));let l=ho(o,n.searchParams);return s(200,await D("collection",n,{collection:l,page_title:o.title,template:{name:"collection"}}))}if(i==="/cart")return s(200,await D("cart",n,{template:{name:"cart"}}));if(i==="/search"){let o=(n.searchParams.get("q")||"").toLowerCase(),l=o?P.filter(c=>c.title.toLowerCase().includes(o)).map(c=>({...c,object_type:"product"})):[];return s(200,await D("search",n,{template:{name:"search"},search:{performed:!!o,terms:o,results:l,results_count:l.length,filters:[],sort_options:Vi,sort_by:"relevance"}}))}return s(404,await D("404",n,{template:{name:"404"}}))}catch(r){console.error(r),s(500,`<pre>${String(r.stack).replace(/</g,"&lt;")}</pre>`)}});go.listen(ut,()=>console.log(`Kala preview \u2192 http://localhost:${ut}`));var ee=new URL("./",self.location.href).pathname.replace(/\/$/,""),_o=/^\/(assets|img)\//,bo=/(["'(\s=,])\/(?!\/)(assets|img|products|collections|cart|search|recommendations|apps|pages|password|account|localization|contact|policies|checkout|blogs)\b/g,yo=/(\s(?:href|action)=["'])\/(?=["'#?])/g,vo=t=>t.replace(bo,`$1${ee}/$2`).replace(yo,`$1${ee}/`),wo=`<div style="position:fixed;left:12px;bottom:12px;z-index:2147483647;background:#111;color:#fff;font:600 12px/1.3 system-ui,sans-serif;padding:8px 12px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25)">Live theme demo \xB7 rendered in your browser \xB7 <a href="${ee}/../" style="color:#ffd27a">about</a></div>`,ko=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Checkout</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.6 system-ui,sans-serif;background:#f4f1ea;color:#1c1c1c;padding:24px;text-align:center">
<div style="max-width:520px"><h1 style="font-size:26px;margin:0 0 8px">This is where Shopify takes over</h1>
<p>Checkout is Shopify's own, hosted page; a theme doesn't render it. Everything up to here (product pages, the cart drawer, cart updates) ran through the theme in your browser.</p>
<p><a href="${ee}/cart">Back to the bag</a> \xB7 <a href="${ee}/../">About this project</a></p></div></body>`,Ui="preview-cart-log",Hi=null;async function xo(){let e=await(await caches.open(Ui)).match("log");for(let n of e?await e.json():[])await Yi(n.method,n.path,n.type,n.body)}async function So(t){let e=await caches.open(Ui),n=await e.match("log"),i=n?await n.json():[];i.push(t),await e.put("log",new Response(JSON.stringify(i)))}var Wi="preview-cookies";async function Ji(){let t=await(await caches.open(Wi)).match("jar");return t?await t.json():{}}async function To(){let t=await Ji();if(self.cookieStore)for(let e of await self.cookieStore.getAll())t[e.name]=e.value;return Object.entries(t).map(([e,n])=>`${e}=${n}`).join("; ")}async function zo(t){if(!t)return;let e=await Ji();for(let n of[].concat(t)){let[i]=String(n).split(";"),s=i.indexOf("=");e[i.slice(0,s).trim()]=i.slice(s+1).trim()}await(await caches.open(Wi)).put("jar",new Response(JSON.stringify(e)))}async function Yi(t,e,n,i,s={}){let a=i?[new TextEncoder().encode(i)]:[],r={method:t,url:e,headers:{"content-type":n||"",cookie:await To(),...s},async*[Symbol.asyncIterator](){yield*a}};return new Promise(o=>{let l=200,c={};gt(r,{writeHead(p,h){l=p,c=h||{}},setHeader(p,h){c[p]=h},end(p){o({status:l,headers:c,content:p})}})})}self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",t=>t.waitUntil(self.clients.claim()));self.addEventListener("fetch",t=>{let e=new URL(t.request.url);if(e.origin!==self.location.origin||!e.pathname.startsWith(ee))return;let n=e.pathname.slice(ee.length)||"/";_o.test(n)||n==="/sw.js"||n==="/boot.html"||t.respondWith((async()=>{Hi??=xo(),await Hi;let i=t.request.method,s=t.request.headers.get("content-type")||"",a=i==="GET"?null:await t.request.text();if(n.startsWith("/checkout")||i==="POST"&&n==="/cart")return new Response(ko,{headers:{"Content-Type":"text/html; charset=utf-8"}});let r=n+e.search,o=await Yi(i,r,s,a,{referer:t.request.referrer||""});await zo(o.headers["Set-Cookie"]||o.headers["set-cookie"]),i==="POST"&&/^\/cart\/(add|change|update)/.test(n)&&o.status<400&&await So({method:i,path:r,type:s,body:a});let l=o.headers["Content-Type"]||o.headers["content-type"]||"text/html; charset=utf-8",c=o.content??"";/html|json/.test(l)&&typeof c=="string"&&(c=vo(c)),l.includes("html")&&t.request.mode==="navigate"&&(c=c.replace("</body>",`${wo}</body>`));let d=o.headers.Location||o.headers.location;return o.status>=300&&o.status<400&&d?Response.redirect(/^https?:/.test(d)?d:ee+d,o.status):new Response(c,{status:o.status,headers:{"Content-Type":l}})})())});
