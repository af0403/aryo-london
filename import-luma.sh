#!/usr/bin/env bash
set -e

ZIP="$HOME/Downloads/Luxury_Fashion_Campaign.zip"
TMP="/tmp/luma-import"
DEST="public/assets/generated/luma-pack"

if [ ! -f "$ZIP" ]; then
  echo "Error: zip not found at $ZIP"
  exit 1
fi

echo "Cleaning tmp..."
rm -rf "$TMP"
mkdir -p "$TMP"

echo "Unzipping..."
unzip -q "$ZIP" -d "$TMP"

mkdir -p "$DEST"

copy_asset() {
  local src="$1"
  local dest="$2"
  # Search recursively — handles any top-level folder the zip may add
  local found
  found=$(find "$TMP" -path "*/$src" 2>/dev/null | head -1)
  if [ -z "$found" ]; then
    echo "  MISSING: $src"
  else
    cp "$found" "$DEST/$dest"
    echo "  OK: $dest"
  fi
}

echo ""
echo "Copying product stills..."
copy_asset "Shots 3-6 Product Campaign Stills/005_A_dark_grey_speckled_jacket_with_a_zip-up_front_tVW8T9nJ.png"      "product-noir-jacket.png"
copy_asset "Shots 3-6 Product Campaign Stills/001_A_black_tweed_jacket_with_a_metallic_sheen_is_Zkl15XPO.png"        "product-noir-jacket-open.png"
copy_asset "Shots 3-6 Product Campaign Stills/002_A_pair_of_dark_grey_speckled_sweatpants_with_a_PMnAiDB.png"        "product-noir-trouser.png"
copy_asset "Shots 3-6 Product Campaign Stills/003_A_pair_of_cream-colored_sweatpants_with_a_subtle_mBPdl_Uh.png"     "product-ivory-trouser.png"
copy_asset "Shots 3-6 Product Campaign Stills/004_A_cream-colored_textured_jacket_with_a_silver_ZV10_k7Z.png"        "product-ivory-jacket.png"

echo ""
echo "Copying detail shots..."
copy_asset "Shots 7-9 Detail Macro Shots/001_A_black_and_white_textured_jacket_with_a_silver_O2X6QxZ3.png"           "detail-noir-hardware.png"
copy_asset "Shots 7-9 Detail Macro Shots/002_A_close-up_shot_showcases_a_white_embroidered_oq6v9-jU.png"             "detail-noir-embroidery.png"
copy_asset "Shots 7-9 Detail Macro Shots/003_A_close-up_shallow_depth_of_field_shot_features_yJSigtkG.png"           "detail-ivory-embroidery.png"

echo ""
echo "Copying wide still..."
copy_asset "Shot 10 Wide Collection Still Life/001_In_a_minimalist_style_a_dark_tweed_jacket_with_a_FT91xMgm.png"    "wide-collection-still-life.png"

echo ""
echo "Copying hero desktop (image + video)..."
copy_asset "Shot 11 Hero Motion Noir Desktop/001_A_man_stands_in_a_sparsely_decorated_room_with_FGeJq_K2.png"        "homepage-hero-noir-desktop.png"
copy_asset "Shot 11 Hero Motion Noir Desktop/002_A_man_in_a_dark_textured_matching_jacket_and_9skGafx-.mp4"          "hero-motion-noir-desktop-v1.mp4"
copy_asset "Shot 11 Hero Motion Noir Desktop/003_A_man_wearing_a_textured_grey_jacket_and_matching_RG1FosyJ.mp4"     "hero-motion-noir-desktop-v2.mp4"
copy_asset "Shot 11 Hero Motion Noir Desktop/004_A_man_in_a_textured_dark_gray_jacket_and_matching_FH8l8e2t.mp4"     "hero-motion-noir-desktop-v3.mp4"
copy_asset "Shot 11 Hero Motion Noir Desktop/005_A_man_wearing_a_textured_charcoal_jacket_and_N_KVXoc3.mp4"          "hero-motion-noir-desktop-v4.mp4"

echo ""
echo "Copying hero mobile (image + video)..."
copy_asset "Shot 12 Hero Motion Noir Mobile/001_In_a_minimalist_style_a_man_stands_near_a_large_LcfEPALX.png"        "homepage-hero-noir-mobile.png"
copy_asset "Shot 12 Hero Motion Noir Mobile/002_A_man_in_a_textured_dark_jacket_and_matching_TwS2a3DS.mp4"           "hero-motion-noir-mobile-v1.mp4"
copy_asset "Shot 12 Hero Motion Noir Mobile/003_A_man_stands_in_a_neutral-toned_room_lit_by_RYh9_sOY.mp4"           "hero-motion-noir-mobile-v2.mp4"
copy_asset "Shot 12 Hero Motion Noir Mobile/004_In_a_cinematic_style_a_man_stands_beside_a_sF01QZQv.mp4"             "hero-motion-noir-mobile-v3.mp4"

echo ""
echo "Done. Files in $DEST:"
ls -1 "$DEST"

echo ""
echo "Cleaning tmp..."
rm -rf "$TMP"
