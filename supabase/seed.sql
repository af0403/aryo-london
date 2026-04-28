insert into public.products (
  slug,
  name,
  line,
  color,
  category,
  price_gbp,
  launch_state,
  fulfillment_mode,
  fulfillment_note,
  summary,
  short_description,
  long_description,
  lead_image,
  card_image,
  gallery,
  details,
  notes
)
values
  (
    'structure-jacket-noir',
    'Structure Jacket',
    'Pennicella | AF by ARYO',
    'Noir',
    'Outerwear',
    200,
    'live',
    'stocked',
    null,
    'The lead outerwear piece from Pennicella, built around structure, silver hardware, and a controlled noir finish.',
    'A cropped jacket with pointed collar, silver zip beneath snap closure, and black lining.',
    'The Structure Jacket in noir is the clearest expression of the first ARYO drop. It carries the Pennicella texture with a sharper silhouette, black interior lining, and restrained hardware that keeps the piece polished rather than loud.',
    '/assets/reference/black-jacket-front.jpeg',
    '/assets/reference/black-jacket-front.jpeg',
    '["/assets/reference/black-jacket-front.jpeg","/assets/reference/black-jacket-open.jpeg","/assets/reference/black-jacket-hardware.jpeg","/assets/reference/black-jacket-label.jpeg"]'::jsonb,
    '[{"label":"Colour","value":"Noir"},{"label":"Price","value":"GBP 200"},{"label":"Closure","value":"Silver zip under snap closure"},{"label":"Interior","value":"Black lining"},{"label":"Origin","value":"Made in London"}]'::jsonb,
    '["Limited opening stock is held across the full size run.","Silver zip and snap hardware are kept deliberately clean against the textured noir surface."]'::jsonb
  ),
  (
    'essential-trouser-noir',
    'Essential Trouser',
    'Pennicella | AF by ARYO',
    'Noir',
    'Trouser',
    100,
    'live',
    'stocked',
    null,
    'The noir trouser is presented as sold out, with the white signature embroidery still held inside the collection story.',
    'Straight, relaxed trouser in noir Pennicella with white ARYO signature embroidery.',
    'The noir Essential Trouser balances the structure jacket with a more fluid line. The shape stays clean and easy, while the dense speckled texture and white signature detail keep it part of the same drop language.',
    '/assets/reference/black-trouser-front.jpeg',
    '/assets/reference/black-trouser-front.jpeg',
    '["/assets/reference/black-trouser-front.jpeg","/assets/reference/black-trouser-back.jpeg","/assets/reference/black-signature-closeup.jpeg","/assets/reference/black-fabric-texture-clean.png"]'::jsonb,
    '[{"label":"Colour","value":"Noir"},{"label":"Price","value":"GBP 100"},{"label":"Silhouette","value":"Relaxed straight leg"},{"label":"Signature","value":"White embroidery at upper leg"},{"label":"Origin","value":"Made in London"}]'::jsonb,
    '["This colourway is now shown as sold out.","The piece remains visible as part of the full Pennicella edit."]'::jsonb
  ),
  (
    'essential-trouser-ivory',
    'Essential Trouser',
    'Pennicella | AF by ARYO',
    'Ivory',
    'Trouser',
    100,
    'live',
    'stocked',
    null,
    'The lighter trouser expression for the drop, cut in ivory with blue signature embroidery.',
    'Straight, relaxed trouser in ivory Pennicella with blue ARYO signature embroidery.',
    'The ivory Essential Trouser opens the drop with a softer tone while keeping the same measured line. The small blue signature detail is the only moment of colour, which keeps the product feeling premium and restrained.',
    '/assets/reference/ivory-trouser-front.jpeg',
    '/assets/reference/ivory-trouser-front.jpeg',
    '["/assets/reference/ivory-trouser-front.jpeg","/assets/reference/ivory-trouser-back.jpeg","/assets/reference/ivory-fabric-texture-clean.png"]'::jsonb,
    '[{"label":"Colour","value":"Ivory"},{"label":"Price","value":"GBP 100"},{"label":"Silhouette","value":"Relaxed straight leg"},{"label":"Signature","value":"Blue embroidery at upper leg"},{"label":"Origin","value":"Made in London"}]'::jsonb,
    '["Current stock is held at 5 small, 10 medium, 10 large, and 5 extra large.","Extra small is not currently available in this colourway."]'::jsonb
  ),
  (
    'structure-jacket-ivory',
    'Structure Jacket',
    'Pennicella | AF by ARYO',
    'Ivory',
    'Outerwear',
    200,
    'live',
    'made-to-order',
    'Made to order. Please allow around 3 weeks before dispatch.',
    'The ivory outerwear expression launches on a made-to-order basis with a longer lead time.',
    'Ivory version of the Structure Jacket, available made to order with a 3 week lead time.',
    'The ivory Structure Jacket expands the first ARYO release without forcing unnecessary stock pressure. It launches live as a made-to-order piece, keeping the same Pennicella direction while allowing a longer production lead time.',
    '/assets/reference/ivory-fabric-texture-clean.png',
    '/assets/reference/ivory-fabric-texture-clean.png',
    '["/assets/reference/ivory-fabric-texture-clean.png","/assets/reference/ivory-fabric-texture.png","/assets/reference/black-jacket-hardware.jpeg"]'::jsonb,
    '[{"label":"Colour","value":"Ivory"},{"label":"Price","value":"GBP 200"},{"label":"Status","value":"Made to order"},{"label":"Lead time","value":"Approximately 3 weeks before dispatch"}]'::jsonb,
    '["This colourway is live as part of the collection and cut on a made-to-order basis.","Final campaign photography for the ivory jacket is still in production."]'::jsonb
  )
on conflict (slug) do update
set
  name = excluded.name,
  line = excluded.line,
  color = excluded.color,
  category = excluded.category,
  price_gbp = excluded.price_gbp,
  launch_state = excluded.launch_state,
  fulfillment_mode = excluded.fulfillment_mode,
  fulfillment_note = excluded.fulfillment_note,
  summary = excluded.summary,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  lead_image = excluded.lead_image,
  card_image = excluded.card_image,
  gallery = excluded.gallery,
  details = excluded.details,
  notes = excluded.notes,
  updated_at = now();

insert into public.product_variants (product_id, sku, size, stock)
select p.id, v.sku, v.size, v.stock
from public.products p
join (
  values
    ('structure-jacket-noir', 'AF-NOIR-STRUCTURE-JACKET-NOIR-XS', 'XS', 1),
    ('structure-jacket-noir', 'AF-NOIR-STRUCTURE-JACKET-NOIR-S', 'S', 1),
    ('structure-jacket-noir', 'AF-NOIR-STRUCTURE-JACKET-NOIR-M', 'M', 1),
    ('structure-jacket-noir', 'AF-NOIR-STRUCTURE-JACKET-NOIR-L', 'L', 1),
    ('structure-jacket-noir', 'AF-NOIR-STRUCTURE-JACKET-NOIR-XL', 'XL', 1),
    ('essential-trouser-noir', 'AF-NOIR-ESSENTIAL-TROUSER-NOIR-XS', 'XS', 0),
    ('essential-trouser-noir', 'AF-NOIR-ESSENTIAL-TROUSER-NOIR-S', 'S', 0),
    ('essential-trouser-noir', 'AF-NOIR-ESSENTIAL-TROUSER-NOIR-M', 'M', 0),
    ('essential-trouser-noir', 'AF-NOIR-ESSENTIAL-TROUSER-NOIR-L', 'L', 0),
    ('essential-trouser-noir', 'AF-NOIR-ESSENTIAL-TROUSER-NOIR-XL', 'XL', 0),
    ('essential-trouser-ivory', 'AF-IVORY-ESSENTIAL-TROUSER-IVORY-XS', 'XS', 0),
    ('essential-trouser-ivory', 'AF-IVORY-ESSENTIAL-TROUSER-IVORY-S', 'S', 5),
    ('essential-trouser-ivory', 'AF-IVORY-ESSENTIAL-TROUSER-IVORY-M', 'M', 10),
    ('essential-trouser-ivory', 'AF-IVORY-ESSENTIAL-TROUSER-IVORY-L', 'L', 10),
    ('essential-trouser-ivory', 'AF-IVORY-ESSENTIAL-TROUSER-IVORY-XL', 'XL', 5),
    ('structure-jacket-ivory', 'AF-IVORY-STRUCTURE-JACKET-IVORY-XS', 'XS', null),
    ('structure-jacket-ivory', 'AF-IVORY-STRUCTURE-JACKET-IVORY-S', 'S', null),
    ('structure-jacket-ivory', 'AF-IVORY-STRUCTURE-JACKET-IVORY-M', 'M', null),
    ('structure-jacket-ivory', 'AF-IVORY-STRUCTURE-JACKET-IVORY-L', 'L', null),
    ('structure-jacket-ivory', 'AF-IVORY-STRUCTURE-JACKET-IVORY-XL', 'XL', null)
) as v(slug, sku, size, stock) on p.slug = v.slug
on conflict (sku) do update
set
  size = excluded.size,
  stock = excluded.stock,
  updated_at = now();

insert into public.launch_settings (key, value)
values
  (
    'site',
    '{
      "collection":"Pennicella | AF by ARYO",
      "shipping":"Worldwide shipping.",
      "supportEmail":"Support email landing shortly",
      "checkoutMode":"prototype",
      "ivoryJacketLeadTime":"3 weeks"
    }'::jsonb
  )
on conflict (key) do update
set
  value = excluded.value,
  updated_at = now();
