# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_05_20_202731) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "conversation_users", force: :cascade do |t|
    t.integer "conversation_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_conversation_users_on_conversation_id"
  end

  create_table "conversations", force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.string "identifier", limit: 255
    t.index ["user_id"], name: "index_conversations_on_user_id"
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "conversation_id", null: false
    t.integer "user_id", null: false
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
  end

  create_table "p2p_paths", force: :cascade do |t|
    t.integer "conversation_id", null: false
    t.integer "sender_id", null: false
    t.integer "receiver_id", null: false
    t.integer "forwarder1", null: false
    t.integer "forwarder2", null: false
    t.integer "forwarder3", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "last_peer", limit: 255
    t.integer "p2p_transaction_id"
    t.index ["conversation_id"], name: "index_p2p_paths_on_conversation_id"
  end

  create_table "p2p_transactions", id: :bigint, default: -> { "nextval('message_p2p_sends_id_seq'::regclass)" }, force: :cascade do |t|
    t.integer "sender_id", null: false
    t.integer "receiver_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "completed", default: false
    t.integer "conversation_id", null: false
    t.integer "author_id"
    t.index ["author_id"], name: "index_p2p_transaction_on_author_id"
    t.index ["conversation_id"], name: "index_p2p_transaction_on_conversation_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "users_ice_candidates", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ice", limit: 255
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_users_ice_candidates_on_user_id"
  end

end
