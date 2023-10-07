# frozen_string_literal: true

class AddMessagesTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE TABLE "messages" (
        "id" BIGSERIAL PRIMARY KEY,
        "conversation_id" INTEGER NOT NULL, 
        "user_id" INTEGER NOT NULL,
        "text" TEXT NULL,
        "created_at" TIMESTAMP(6) NOT NULL,
        "updated_at" TIMESTAMP(6) NOT NULL
      );
    SQL

    execute <<-SQL
      CREATE INDEX "index_messages_on_conversation_id" ON "messages" ("conversation_id");
    SQL
  end

  def down
    execute <<-SQL
      DROP INDEX "index_messages_on_conversation_id";
    SQL

    execute <<-SQL
      DROP TABLE "messages";
    SQL
  end
end
