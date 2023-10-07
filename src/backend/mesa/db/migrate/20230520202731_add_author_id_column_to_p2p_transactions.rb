class AddAuthorIdColumnToP2pTransactions < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE "p2p_transactions" ADD COLUMN "author_id" INTEGER NULL;
    SQL

    execute <<-SQL
      CREATE INDEX "index_p2p_transaction_on_author_id" ON "p2p_transactions" ("author_id");
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "p2p_transactions" DROP COLUMN "author_id";
    SQL

    execute <<-SQL
      DROP INDEX "index_p2p_transaction_on_author_id";
    SQL
  end
end
