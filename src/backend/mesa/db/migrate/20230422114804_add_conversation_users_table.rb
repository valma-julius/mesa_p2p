# frozen_string_literal: true

class AddConversationUsersTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE TABLE "conversation_users" (
        "id" BIGSERIAL PRIMARY KEY,
        "conversation_id" INTEGER NOT NULL, 
        "user_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP(6) NOT NULL,
        "updated_at" TIMESTAMP(6) NOT NULL
      );
    SQL

    execute <<-SQL
      CREATE INDEX "index_conversation_users_on_conversation_id" ON "conversation_users" ("conversation_id");
    SQL
  end

  def down
    execute <<-SQL
      DROP INDEX "index_conversation_users_on_conversation_id";
    SQL

    execute <<-SQL
      DROP TABLE "conversation_users";
    SQL
  end
end
