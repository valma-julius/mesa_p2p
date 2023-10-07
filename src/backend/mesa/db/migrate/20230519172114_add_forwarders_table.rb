# frozen_string_literal: true

class AddForwardersTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE TABLE "p2p_paths" (
        "id" BIGSERIAL PRIMARY KEY,
        "conversation_id" INTEGER NOT NULL,
        "sender_id" INTEGER NOT NULL,
        "receiver_id" INTEGER NOT NULL,
        "forwarder1" INTEGER NOT NULL,
        "forwarder2" INTEGER NOT NULL,
        "forwarder3" INTEGER NOT NULL,
        "created_at" TIMESTAMP(6) NOT NULL,
        "updated_at" TIMESTAMP(6) NOT NULL
      );
    SQL

    execute <<-SQL
      CREATE INDEX "index_p2p_paths_on_conversation_id" ON "p2p_paths" ("conversation_id");
    SQL
  end

  def down
    execute <<-SQL
      DROP INDEX "index_p2p_paths_on_conversation_id";
    SQL

    execute <<-SQL
      DROP TABLE "p2p_paths";
    SQL
  end
end
